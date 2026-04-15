from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Connect to PostgreSQL (Update with your actual credentials)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Jannat30@localhost:5432/jlpt_n4_db")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# The Dependency Provider
def get_db():
    db = SessionLocal()
    try:
        yield db  # FastAPI injects this 'db' into your routes
    except Exception:
        # If a DB error occurs, we still want to close the connection
        db.rollback()
        raise
    finally:
        db.close()  # CRITICAL: Prevents 500 errors caused by connection leaks
