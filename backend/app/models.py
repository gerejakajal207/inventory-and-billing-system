from sqlalchemy import Column, Integer, String, DECIMAL, ForeignKey, Date
from .database import Base


class Customer(Base):
    __tablename__ = "Customer"

    customer_id = Column(Integer, primary_key=True, index=True)
    name        = Column(String(100))
    email       = Column(String(100))
    phone       = Column(String(20))
    address     = Column(String(255))


class Product(Base):
    __tablename__ = "Product"

    product_id  = Column(Integer, primary_key=True, index=True)
    prod_name   = Column(String(100))
    category    = Column(String(100))
    brand       = Column(String(100))
    unit_price  = Column(DECIMAL(10, 2))


class Invoice(Base):
    __tablename__ = "Invoice"

    invoice_id  = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("Customer.customer_id"))
    inv_date    = Column(Date)
    due_date    = Column(Date)
    total_amt   = Column(DECIMAL(10, 2))
    status      = Column(String(50))