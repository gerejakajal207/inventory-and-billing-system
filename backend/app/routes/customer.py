from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import crud, schemas
from typing import Optional

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_all_customers(search: Optional[str] = "", db: Session = Depends(get_db)):
    return crud.get_customers(db, search)

@router.post("/")
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    return crud.create_customer(db, customer)

@router.put("/{customer_id}")
def update_customer(customer_id: int, customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    result = crud.update_customer(db, customer_id, customer)
    if not result:
        raise HTTPException(status_code=404, detail="Customer not found")
    return result

@router.delete("/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    result = crud.delete_customer(db, customer_id)
    if not result:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"message": "Deleted"}