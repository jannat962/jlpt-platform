from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, JSON, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    readiness_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    sessions = relationship("TestSession", back_populates="user")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, index=True) # e.g., Test #739
    section = Column(Integer) # 0: Kanji, 1: Grammar/Reading, 2: Listening
    number = Column(Integer)
    type = Column(String) # "Vocabulary", "Reading Comprehension", "Listening"
    question_text = Column(String)
    options = Column(JSON) # Stores list of options: ["A", "B", "C", "D"]
    correct_index = Column(Integer)
    audio_url = Column(String, nullable=True) # For Listening section
    image_url = Column(String, nullable=True) # For visual questions (Mondai 1, 2, etc.)

class TestSession(Base):
    __tablename__ = "test_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    test_id = Column(Integer, index=True)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    score = Column(Float, nullable=True)
    is_completed = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="sessions")
    answers = relationship("UserAnswer", back_populates="session")

class UserAnswer(Base):
    __tablename__ = "user_answers"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("test_sessions.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    selected_index = Column(Integer)
    is_correct = Column(Boolean)

    # Relationships
    session = relationship("TestSession", back_populates="answers")
