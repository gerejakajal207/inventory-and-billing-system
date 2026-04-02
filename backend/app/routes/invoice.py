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
def get_invoices(status: Optional[str] = "", db: Session = Depends(get_db)):
    return crud.get_invoices(db, status=status)

@router.post("/")
def create_invoice(invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    return crud.create_invoice(db, invoice)

@router.put("/{invoice_id}")
def update_invoice(invoice_id: int, invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    result = crud.update_invoice(db, invoice_id, invoice)
    if not result:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return result

@router.delete("/{invoice_id}")
def delete_invoice(invoice_id: int, db: Session = Depends(get_db)):
    result = crud.delete_invoice(db, invoice_id)
    if not result:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return {"message": "Deleted"}