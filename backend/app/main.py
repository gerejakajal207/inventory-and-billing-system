from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import customer, product, dashboard, invoice, auth

app = FastAPI(title="Inventory & Billing API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,      prefix="/auth")
app.include_router(dashboard.router, prefix="/dashboard")
app.include_router(customer.router,  prefix="/customers")
app.include_router(product.router,   prefix="/products")
app.include_router(invoice.router,   prefix="/invoices")