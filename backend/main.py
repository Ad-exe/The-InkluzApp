import base64
import io
import os

import numpy as np
import cv2
from PIL import Image
from fastapi import FastAPI, UploadFile, File, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change later to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Model loading (auto fallback) ----
# 1) If backend/weights/best.pt exists => use it
# 2) Else => use yolov8n.pt (auto-downloads)
CUSTOM_WEIGHTS = "weights/best.pt"

if os.path.exists(CUSTOM_WEIGHTS):
    MODEL_PATH = CUSTOM_WEIGHTS
else:
    MODEL_PATH = "yolov8n.pt"

model = YOLO(MODEL_PATH)


@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL_PATH}


def predict_from_bgr(img_bgr: np.ndarray):
    results = model.predict(img_bgr, conf=0.25, verbose=False)
    r = results[0]

    out = []
    if r.boxes is None:
        return out

    boxes = r.boxes.xyxy.cpu().numpy()
    confs = r.boxes.conf.cpu().numpy()
    clss = r.boxes.cls.cpu().numpy().astype(int)

    for (x1, y1, x2, y2), c, k in zip(boxes, confs, clss):
        out.append(
            {
                "class_id": int(k),
                "confidence": float(c),
                "box": [float(x1), float(y1), float(x2), float(y2)],
            }
        )
    return out


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    data = await file.read()
    img = Image.open(io.BytesIO(data)).convert("RGB")
    img_np = np.array(img)
    img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)

    preds = predict_from_bgr(img_bgr)
    return {"predictions": preds}


@app.websocket("/ws")
async def ws_predict(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            msg = await websocket.receive_json()
            # expected: { "image": "data:image/jpeg;base64,...." }
            b64 = msg["image"].split(",")[-1]
            raw = base64.b64decode(b64)

            img = Image.open(io.BytesIO(raw)).convert("RGB")
            img_np = np.array(img)
            img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)

            preds = predict_from_bgr(img_bgr)
            await websocket.send_json({"predictions": preds})
    except Exception:
        await websocket.close()
