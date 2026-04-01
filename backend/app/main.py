from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import customer, product, dashboard

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customer.router, prefix="/customers")
app.include_router(product.router, prefix="/products")
app.include_router(dashboard.router, prefix="/dashboard")
