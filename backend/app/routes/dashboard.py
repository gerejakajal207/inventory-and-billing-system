from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from ..database import SessionLocal
from .. import models

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
    customers = db.query(func.count(models.Customer.customer_id)).scalar() or 0
    products  = db.query(func.count(models.Product.product_id)).scalar() or 0
    low_stock = db.query(func.count(models.Product.product_id))\
                  .filter(models.Product.stock_qty <= models.Product.min_stock).scalar() or 0

    # Monthly revenue for chart (last 6 months)
    monthly = db.query(
        extract('month', models.Invoice.inv_date).label('month'),
        extract('year',  models.Invoice.inv_date).label('year'),
        func.sum(models.Invoice.total_amt).label('total')
    ).group_by('year', 'month').order_by('year', 'month').limit(12).all()

    monthly_data = [
        {"month": int(r.month), "year": int(r.year), "total": float(r.total or 0)}
        for r in monthly
    ]

    # Category breakdown for donut chart
    category_data = db.query(
        models.Product.category,
        func.count(models.Product.product_id).label('count')
    ).group_by(models.Product.category).all()

    categories = [{"category": r.category, "count": r.count} for r in category_data]

    return {
        "revenue":      float(revenue),
        "invoices":     invoices,
        "paid":         paid,
        "unpaid":       unpaid,
        "customers":    customers,
        "products":     products,
        "low_stock":    low_stock,
        "monthly_data": monthly_data,
        "categories":   categories,
    }