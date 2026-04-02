from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ── Auth ────────────────────────────────────────────────────────
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed = pwd_context.hash(user.password)
    db_user = models.User(username=user.username, email=user.email, password=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)


# ── Customers ───────────────────────────────────────────────────
def get_customers(db: Session, search: str = ""):
    q = db.query(models.Customer)
    if search:
        q = q.filter(models.Customer.name.ilike(f"%{search}%"))
    return q.all()

def create_customer(db: Session, customer: schemas.CustomerCreate):
    db_customer = models.Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def update_customer(db: Session, customer_id: int, data: schemas.CustomerCreate):
    c = db.query(models.Customer).filter(models.Customer.customer_id == customer_id).first()
    if not c:
        return None
    for k, v in data.dict().items():
        setattr(c, k, v)
    db.commit()
    db.refresh(c)
    return c

def delete_customer(db: Session, customer_id: int):
    c = db.query(models.Customer).filter(models.Customer.customer_id == customer_id).first()
    if c:
        db.delete(c)
        db.commit()
    return c


# ── Products ────────────────────────────────────────────────────
def get_products(db: Session, search: str = "", category: str = ""):
    q = db.query(models.Product)
    if search:
        q = q.filter(models.Product.prod_name.ilike(f"%{search}%"))
    if category:
        q = q.filter(models.Product.category == category)
    return q.all()

def get_low_stock_products(db: Session):
    return db.query(models.Product).filter(
        models.Product.stock_qty <= models.Product.min_stock
    ).all()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, data: schemas.ProductCreate):
    p = db.query(models.Product).filter(models.Product.product_id == product_id).first()
    if not p:
        return None
    for k, v in data.dict().items():
        setattr(p, k, v)
    db.commit()
    db.refresh(p)
    return p

def delete_product(db: Session, product_id: int):
    p = db.query(models.Product).filter(models.Product.product_id == product_id).first()
    if p:
        db.delete(p)
        db.commit()
    return p


# ── Invoices ────────────────────────────────────────────────────
def get_invoices(db: Session, search: str = "", status: str = ""):
    q = db.query(models.Invoice)
    if status:
        q = q.filter(models.Invoice.status == status)
    return q.all()

def create_invoice(db: Session, invoice: schemas.InvoiceCreate):
    db_inv = models.Invoice(**invoice.dict())
    db.add(db_inv)
    db.commit()
    db.refresh(db_inv)
    return db_inv

def update_invoice(db: Session, invoice_id: int, data: schemas.InvoiceCreate):
    inv = db.query(models.Invoice).filter(models.Invoice.invoice_id == invoice_id).first()
    if not inv:
        return None
    for k, v in data.dict().items():
        setattr(inv, k, v)
    db.commit()
    db.refresh(inv)
    return inv

def delete_invoice(db: Session, invoice_id: int):
    inv = db.query(models.Invoice).filter(models.Invoice.invoice_id == invoice_id).first()
    if inv:
        db.delete(inv)
        db.commit()
    return inv