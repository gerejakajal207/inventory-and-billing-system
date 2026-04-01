from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import SessionLocal   # ← two dots, not one
from .. import models                 # ← two dots, not one

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def dashboard(db: Session = Depends(get_db)):
    revenue  = db.query(func.sum(models.Invoice.total_amt)).scalar() or 0
    invoices = db.query(func.count(models.Invoice.invoice_id)).scalar() or 0
    paid     = db.query(func.count(models.Invoice.invoice_id))\
                 .filter(models.Invoice.status == "Paid").scalar() or 0
    unpaid   = db.query(func.count(models.Invoice.invoice_id))\
                 .filter(models.Invoice.status == "Unpaid").scalar() or 0

    return {
        "revenue":  float(revenue),
        "invoices": invoices,
        "paid":     paid,
        "unpaid":   unpaid,
    }