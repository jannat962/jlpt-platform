from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .routers import exam

# Comment out table creation until database is set up
# models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="JLPT N4 Mock Test API", version="1.0.0")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for development
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

# We will mount routers here later
# app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
# app.include_router(exam.router, prefix="/api/tests", tags=["Exams"])
