from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import crud, schemas
from jose import jwt
from datetime import datetime, timedelta
import os

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "changeme_secret_key_123")
ALGORITHM  = "HS256"
EXPIRE_MIN = 60 * 24  # 24 hours

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_token(data: dict):
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(minutes=EXPIRE_MIN)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    crud.create_user(db, user)
    token = create_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if not db_user or not crud.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}