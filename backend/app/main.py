import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .routers import exam

# Auto-create all tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="JLPT N4 Mock Test API", version="1.0.0")

# Configure CORS — allow localhost for dev and Vercel for production
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://*.vercel.app",
    os.getenv("FRONTEND_URL", ""),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Keep open for now; tighten after deploy
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the JLPT N4 API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Register the exam routes
app.include_router(exam.router, prefix="/api/tests", tags=["Exam Engine"])
