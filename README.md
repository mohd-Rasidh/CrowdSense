# 🎯 CrowdSense AI Platform

Welcome to **CrowdSense AI**! 🚀 A cutting-edge, real-time crowd monitoring and analytics platform. CrowdSense uses advanced computer vision (YOLOv8) to process live video feeds, detect individuals, and provide actionable density analytics through a stunning, real-time interactive dashboard. 🌟

---

## ✨ Features

- **🔴 Live Video Processing:** Streams your webcam feed directly to a high-performance backend via WebSockets.
- **🧠 AI-Powered Detection:** Uses state-of-the-art YOLOv8 models to accurately detect people in real-time.
- **📊 Real-Time Analytics:** Instantly calculates crowd count and density, complete with dynamic live-updating charts.
- **⚠️ Automated Alerts:** Visually triggers warnings and danger states when crowd density exceeds safe thresholds.
- **🎨 Stunning UI/UX:** Built with React, Tailwind CSS, and Framer Motion for a sleek, glassmorphic dark-mode experience.

---

## 🛠️ Tech Stack

### 🎨 Frontend (Web App)
- ⚛️ **React + Vite** - Ultra-fast development environment
- 🌊 **Tailwind CSS** - Beautiful utility-first styling
- 🎭 **Framer Motion** - Smooth micro-animations
- 📈 **Recharts** - Dynamic data visualization
- 🔌 **WebSockets** - Real-time communication

### ⚙️ Backend (API)
- ⚡ **FastAPI** - High-performance Python web framework
- 🤖 **YOLOv8 (Ultralytics)** - Industry-leading object detection
- 📷 **OpenCV** - Robust image and frame processing
- 🐍 **Python 3** - Core backend language

---

## 🚀 Getting Started

Follow these instructions to get the project up and running locally on your machine.

### 1️⃣ Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (for the frontend)
- [Python 3.8+](https://www.python.org/) (for the backend)

### 2️⃣ Running the Backend ⚙️

Open a terminal, navigate to the `backend` directory, and run the FastAPI server:

```bash
cd backend

# If using a virtual environment (recommended):
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Start the server
uvicorn main:app --reload
```
*The backend will be running at `http://127.0.0.1:8000/`*

### 3️⃣ Running the Frontend 🎨

Open a new terminal window, navigate to the `frontend` directory, and start the Vite development server:

```bash
cd frontend

# Install dependencies (only needed the first time)
npm install

# Start the dev server
npm run dev
```
*The frontend will be running at `http://localhost:5173/`*

---

## 💡 Usage
1. Open your browser and navigate to `http://localhost:5173/`.
2. Allow camera permissions when prompted.
3. Watch the dashboard come alive with real-time detection, analytics, and crowd density alerts! 🎉

---

Made with ❤️ by the CrowdSense Team.
