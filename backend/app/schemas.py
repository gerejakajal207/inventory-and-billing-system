from pydantic import BaseModel

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


class ProductBase(BaseModel):
    prod_name: str
    category: str
    brand: str
    unit_price: float

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    product_id: int

    class Config:
        from_attributes = True