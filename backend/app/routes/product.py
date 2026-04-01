from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import crud

router = APIRouter()   # ← AGAIN

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_products(db: Session = Depends(get_db)):
    return crud.get_products(db)