from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router, get_current_user
from yolo_engine import process_frame
import base64
import cv2
import numpy as np
import traceback

app = FastAPI(title="CrowdSense AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

manager = ConnectionManager()

@app.websocket("/ws/video-stream")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Receive base64 encoded frame from frontend
            data = await websocket.receive_text()
            
            # Remove header if present (e.g., 'data:image/jpeg;base64,')
            if ',' in data:
                data = data.split(',')[1]
                
            frame_bytes = base64.b64decode(data)
            
            # Convert bytes to numpy array then to OpenCV image
            nparr = np.frombuffer(frame_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if frame is not None:
                # Process the frame using YOLOv8
                processed_frame, count, density = process_frame(frame)
                
                # Encode the processed frame back to base64
                _, buffer = cv2.imencode('.jpg', processed_frame)
                encoded_frame = base64.b64encode(buffer).decode('utf-8')
                
                # Create the payload to send back
                payload = {
                    "image": f"data:image/jpeg;base64,{encoded_frame}",
                    "count": count,
                    "density": density,
                    "alert": density > 0.8 # arbitrary threshold
                }
                
                # Send the payload to the client
                await websocket.send_json(payload)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        traceback.print_exc()
        manager.disconnect(websocket)

@app.get("/")
def read_root():
    return {"message": "Welcome to CrowdSense AI API"}
