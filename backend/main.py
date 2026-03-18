from fastapi import FastAPI, Depends, UploadFile, File
from typing import Annotated
import shutil
import os
import json

from fastapi.middleware.cors import CORSMiddleware

from chatbot import router as chatbot_router
import users
import auth
import invoice
from auth import get_current_user
from database import Base, engine, SessionLocal
from models import Invoice
from ocr_model import process_invoice

# =========================
# Create App FIRST
# =========================
app = FastAPI()

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# DB init
# =========================
Base.metadata.create_all(bind=engine)

# =========================
# Routers
# =========================
app.include_router(chatbot_router, prefix="/api")
app.include_router(auth.router)
app.include_router(invoice.router)
app.include_router(users.router)

# =========================
# Protected test route
# =========================
user_dependency = Annotated[dict, Depends(get_current_user)]

@app.get("/")
def protected(user: user_dependency):
    return {
        "message": "JWT validated successfully",
        "user": user
    }

# =========================
# Upload Receipt
# =========================
@app.post("/upload-receipt")
async def upload_receipt(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user),
):
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    ocr_result = process_invoice(file_path)

    db = SessionLocal()
    try:
        invoice = Invoice(
            filename=file.filename,
            file_path=file_path,
            user_id=user["id"],
            ocr_text=ocr_result.get("ocr_text"),
            extracted_fields=json.dumps(ocr_result.get("extracted_fields")),
        )
        db.add(invoice)
        db.commit()
        db.refresh(invoice)
    finally:
        db.close()

    return {
        "filename": file.filename,
        **ocr_result,
    }