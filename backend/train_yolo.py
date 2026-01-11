from ultralytics import YOLO

model = YOLO("yolov8n.pt")

model.train(
    data="data.yaml",
    epochs=30,
    imgsz=640,
    batch=16,
    project="runs",
    name="handsigns"
)

