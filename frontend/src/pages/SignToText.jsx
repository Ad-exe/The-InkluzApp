import { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import * as drawing from "@mediapipe/drawing_utils";
import { useLocation } from "react-router-dom";

export default function SignToText() {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const wsRef = useRef(null);
  const cameraRef = useRef(null);
  const handsRef = useRef(null);
const resetAll = () => {
  setWord("");
  setCurrent("-");
};

  const [wsStatus, setWsStatus] = useState("disconnected");
  const [handSeen, setHandSeen] = useState(false);
  const [current, setCurrent] = useState("-");
  const [word, setWord] = useState("")
    // 👇 ADD HERE
  const location = useLocation();
  const practiceTarget = location.state?.practiceTarget || null;


  const WS_URL = "ws://127.0.0.1:8000/ws";

  const connectWS = () => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => setWsStatus("connected");
    ws.onclose = () => setWsStatus("disconnected");
    ws.onerror = () => setWsStatus("error");

    ws.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }
      if (data?.error) return;

      setCurrent(data.current ?? "-");
      setWord(data.word ?? "");
    };
  };

  useEffect(() => {
    connectWS();

    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    handsRef.current = hands;

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    hands.onResults((results) => {
      const canvas = overlayRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      const w = video.videoWidth || 640;
      const h = video.videoHeight || 480;

      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const handed = results.multiHandedness?.[0]?.label || "Unknown";

      if (results.multiHandLandmarks?.length) {
        setHandSeen(true);
        const lm = results.multiHandLandmarks[0];

        drawing.drawConnectors(ctx, lm, Hands.HAND_CONNECTIONS);
        drawing.drawLandmarks(ctx, lm);

        const ws = wsRef.current;
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              landmarks: lm.map((p) => [p.x, p.y, p.z]),
              handedness: handed,
            })
          );
        }
      } else {
        setHandSeen(false);
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current && handsRef.current) {
          await handsRef.current.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480,
    });

    cameraRef.current = camera;
    camera.start();

    return () => {
      try { cameraRef.current?.stop(); } catch {}
      try { handsRef.current?.close(); } catch {}
      try { wsRef.current?.close(); } catch {}
    };
  }, []);

  return (
    <div className="page sttPage">
      <div className="toolHeader">
        <h1 className="toolTitle">INKLUZ — Live Gesture → Word Builder</h1>
        <p className="toolSub">
          WebSocket: <b>{wsStatus}</b> | Hand detected: <b>{handSeen ? "Yes" : "No"}</b>
        </p>
            {practiceTarget && (
      <div className="practiceBanner">
        Practice Target: <b>{practiceTarget}</b>
        <span className="practiceHint">
          Show this sign to practice it
        </span>
      </div>
    )}

      </div>

      <div className="sttGrid">
        <div className="sttVideo">
          <video ref={videoRef} autoPlay playsInline muted />
          <canvas ref={overlayRef} />
        </div>

        <div className="card panel">
          <h2 className="panelTitle">Current</h2>
          <div className="currentValue">{current}</div>

          <h2 className="panelTitle" style={{ marginTop: 18 }}>Word</h2>
          <div className="wordValue">{word || "-"}</div>
           <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
    <button className="btn" onClick={resetAll}>
      Reset
    </button>
  </div>
          <p className="tip">Tip: Hold the same sign steady ~1s to add a letter.</p>
        </div>
      </div>
    </div>
  );
}
