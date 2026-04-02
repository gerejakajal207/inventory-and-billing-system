from pydantic import BaseModel
from typing import Optional
from datetime import date


# ── Auth ────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str


# ── Customer ────────────────────────────────────────────────────
class CustomerBase(BaseModel):
    name: str
    email: str
    phone: str
    address: str

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    customer_id: int
    class Config:
        from_attributes = True


# ── Product ─────────────────────────────────────────────────────
class ProductBase(BaseModel):
    prod_name: str
    category: str
    brand: str
    unit_price: float
    stock_qty: Optional[int] = 0
    min_stock: Optional[int] = 10

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    product_id: int
    class Config:
        from_attributes = True


# ── Invoice ─────────────────────────────────────────────────────
class InvoiceBase(BaseModel):
    customer_id: int
    inv_date: date
    due_date: date
    total_amt: float
    status: str

class InvoiceCreate(InvoiceBase):
    pass

class Invoice(InvoiceBase):
    invoice_id: int
    class Config:
        from_attributes = True