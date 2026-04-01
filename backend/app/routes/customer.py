from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import crud, schemas

router = APIRouter()   # ← THIS LINE WAS MISSING (your main issue)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_all_customers(db: Session = Depends(get_db)):
    return crud.get_customers(db)

@router.post("/")
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    return crud.create_customer(db, customer)