# 🇯🇵 JLPT Mock Test Platform - Setup Guide

This project is a high-fidelity JLPT Mock Test platform featuring a **FastAPI** backend and a **React (Vite)** frontend. It includes automated scoring, section-wise analysis, and audio integration.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
*   **Python 3.10+**
*   **Node.js (v18+) & npm**
*   **PostgreSQL** (Running locally with a database named `jlpt_n4_db` or as configured in `.env`)

---

## 📂 Project Structure
```text
jlpt-platform/
├── backend/          # FastAPI Server
├── frontend/         # React + Vite Frontend
└── audio/            # Source Audio Files
```

---

## 🚀 Backend Setup

1.  **Navigate to backend directory**:
    ```bash
    cd backend
    ```

2.  **Create and Activate Virtual Environment**:
    ```bash
    python -m venv venv
    # Windows:
    .\venv\Scripts\activate
    # Mac/Linux:
    source venv/bin/activate
    ```

3.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment**:
    Open `.env` and update your PostgreSQL credentials:
    ```env
    DATABASE_URL=postgresql://user:password@localhost:5432/jlpt_n4_db
    ```

5.  **Initialize & Seed Database**:
    ```bash
    python init_db.py           # Creates tables
    python seed_final_test.py    # Seeds the final 27-question mock paper
    ```

6.  **Run the Server**:
    ```bash
    python -m uvicorn app.main:app --reload
    ```
    *The API will be available at `http://localhost:8000`*

---

## 🎨 Frontend Setup

1.  **Navigate to frontend directory**:
    ```bash
    cd ../frontend
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    *The App will be available at `http://localhost:5173`*

---

## 🎧 Audio Assets
If you add new audio files, place them in the `audio/` folder and copy them to `frontend/public/audio/` so the browser can serve them:
```bash
cp ../audio/*.mp4 ./public/audio/
```

---

## ✅ Features Implemented
*   **Mondai 1-3**: Complete Kanji, Grammar, Reading, and Listening sections.
*   **Instant Result**: Real-time scoring upon submission.
*   **Detailed Analysis**: Section-by-section performance breakdown.
*   **Premium UI**: Minimalist "Paper-style" Japanese exam aesthetic.