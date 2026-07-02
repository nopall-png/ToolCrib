import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# TRIK SENIOR ARCHITECT: 
# Paksa Python mencari file .env tepat 2 lantai di atas posisi file database.py ini berada
# Jadi mau kamu jalankan uvicorn dari folder manapun di bumi ini, dia TIDAK AKAN NYASAR lagi.
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / ".env"

load_dotenv(dotenv_path=env_path, override=True)

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError(f"❌ FATAL ERROR: File .env tidak terbaca di jalur: {env_path}")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()