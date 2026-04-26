import cv2
import numpy as np
from ultralytics import YOLO

# Load the YOLOv8 model (this will download yolov8n.pt on the first run)
try:
    model = YOLO("yolov8n.pt")
except Exception as e:
    print(f"Error loading YOLO model: {e}")
    model = None

def process_frame(frame: np.ndarray):
    """
    Process a single frame through YOLOv8.
    Returns:
        - annotated_frame: frame with bounding boxes and heatmap overlay
        - person_count: number of people detected
        - density_level: a 0-1 scale of crowd density
    """
    if model is None:
        return frame, 0, 0.0

    # Run inference on the frame
    # Conf=0.3 to reduce false positives, classes=0 restricts to 'person'
    results = model(frame, conf=0.3, classes=0, verbose=False)
    
    person_count = 0
    
    # Generate an empty heatmap
    heatmap = np.zeros(frame.shape[:2], dtype=np.float32)

    if len(results) > 0:
        result = results[0]
        boxes = result.boxes
        person_count = len(boxes)
        
        # Annotate bounding boxes and build heatmap
        for box in boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            
            # Draw bounding box
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            
            # Add to heatmap (simple Gaussian-like addition)
            cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
            w, h = x2 - x1, y2 - y1
            radius = max(w, h) // 2
            
            cv2.circle(heatmap, (cx, cy), radius, 1.0, -1)
            
            # Optionally blur the heatmap for smoother gradients
            heatmap = cv2.GaussianBlur(heatmap, (51, 51), 0)

    # Normalize heatmap and convert to color map
    if np.max(heatmap) > 0:
        heatmap = heatmap / np.max(heatmap)
    heatmap_colored = cv2.applyColorMap(np.uint8(255 * heatmap), cv2.COLORMAP_JET)
    
    # Overlay heatmap on the frame
    alpha = 0.4 # heatmap opacity
    annotated_frame = cv2.addWeighted(heatmap_colored, alpha, frame, 1 - alpha, 0)
    
    # Calculate density (very naive approach for demo: density = area covered by people / total area)
    # Here we just use a simplified formula based on count
    # Let's assume max capacity is 50 people for density 1.0
    density_level = min(person_count / 50.0, 1.0)
    
    return annotated_frame, person_count, density_level
