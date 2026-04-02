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
def get_products(search: Optional[str] = "", category: Optional[str] = "", db: Session = Depends(get_db)):
    return crud.get_products(db, search, category)

@router.get("/low-stock")
def get_low_stock(db: Session = Depends(get_db)):
    return crud.get_low_stock_products(db)

@router.post("/")
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, product)

@router.put("/{product_id}")
def update_product(product_id: int, product: schemas.ProductCreate, db: Session = Depends(get_db)):
    result = crud.update_product(db, product_id, product)
    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
    return result

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    result = crud.delete_product(db, product_id)
    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Deleted"}