import os
import re
from typing import List, Optional, Tuple

import numpy as np
import joblib
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

CSV_PATH = os.path.join(BASE_DIR, "data", "alphabet.csv")
MODEL_PATH = os.path.join(BASE_DIR, "models", "gesture_clf.pkl")

gesture_clf = joblib.load(MODEL_PATH)


def read_feature_pairs_from_csv_header(csv_path: str) -> List[Tuple[int, int]]:
    """
    Reads first line of CSV and extracts features like: dist_20_0, dist_16_12, ...
    Returns the list of (a,b) pairs in the SAME order as CSV columns.
    """
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"alphabet.csv not found at: {csv_path}")

    with open(csv_path, "r", encoding="utf-8") as f:
        header = f.readline().strip()

    cols = [c.strip() for c in header.split(",") if c.strip()]
    pairs: List[Tuple[int, int]] = []

    for c in cols:
        m = re.fullmatch(r"dist_(\d+)_(\d+)", c)
        if m:
            a = int(m.group(1))
            b = int(m.group(2))
            pairs.append((a, b))

    if not pairs:
        raise ValueError(
            "No dist_*_* feature columns found in alphabet.csv header. "
            "Expected columns like dist_20_0, dist_16_12, ..."
        )

    return pairs


DIST_PAIRS = read_feature_pairs_from_csv_header(CSV_PATH)


def compute_features(joints_21x3: np.ndarray) -> np.ndarray:
    # 🔹 NORMALIZATION STEP (VERY IMPORTANT)
    # Use wrist (0) → middle finger MCP (9) as scale reference
    scale = float(np.linalg.norm(joints_21x3[0] - joints_21x3[9])) + 1e-6

    feats = []
    for a, b in DIST_PAIRS:
        d = float(np.linalg.norm(joints_21x3[a] - joints_21x3[b])) / scale
        feats.append(d)

    return np.array(feats, dtype=np.float32).reshape(1, -1)



@app.get("/health")
def health():
    return {
        "status": "ok",
        "feature_count": len(DIST_PAIRS),
        "csv_path": CSV_PATH,
    }


@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket):
    await ws.accept()

    word: List[str] = []
    last_letter: str = ""
    static_gesture: int = 0

    try:
        while True:
            msg = await ws.receive_json()
            landmarks = msg.get("landmarks")

            if not landmarks or len(landmarks) != 21:
                await ws.send_json({
                    "has_hand": False,
                    "current": None,
                    "word": "".join(word),
                    "added": False,
                    "added_value": None
                })
                continue

            try:
                joints = np.array(landmarks, dtype=np.float32).reshape(21, 3)
                handed = msg.get("handedness", "Unknown")
                 # Mirror x for left hand to match right-hand training
                if handed == "Left":
                  joints[:, 0] = 1.0 - joints[:, 0]

                X = compute_features(joints)

                pred = gesture_clf.predict(X)[0]

# map numeric classes -> letters
                if isinstance(pred, (int, np.integer)) or str(pred).isdigit():
                  idx = int(pred)
                  if 0 <= idx <= 25:
                    pred_letter = chr(ord("A") + idx)
                  else:
                   pred_letter = str(pred)
                else:
                 pred_letter = str(pred)
                 print("RAW PRED:", pred, "->", pred_letter)



            except Exception as e:
                await ws.send_json({
                    "error": f"Predict error: {e}",
                    "has_hand": True,
                    "current": None,
                    "word": "".join(word),
                    "added": False,
                    "added_value": None
                })
                continue

            added = False
            added_value: Optional[str] = None

            if last_letter == pred_letter:
                static_gesture += 1
            else:
                last_letter = pred_letter
                static_gesture = 0

            if static_gesture > 6:
                word.append(pred_letter)
                added = True
                added_value = pred_letter
                static_gesture = 0

            await ws.send_json({
                "has_hand": True,
                "current": pred_letter,
                "word": "".join(word),
                "added": added,
                "added_value": added_value
            })

    except WebSocketDisconnect:
        pass
