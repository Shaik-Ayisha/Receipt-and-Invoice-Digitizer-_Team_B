from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import shutil
import os
import json

from database import SessionLocal
from models import Invoice
from auth import get_current_user
from ocr_model import process_invoice

router = APIRouter(prefix="/invoice")

UPLOAD_FOLDER = "uploads"


# =========================
# DB dependency
# =========================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# 📤 Upload Invoice (OCR + DB SAVE)
# =========================
@router.post("/upload")
def upload_invoice(
    file: UploadFile = File(...),
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # ensure uploads folder exists
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    file_location = f"{UPLOAD_FOLDER}/{file.filename}"

    # save file
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ✅ RUN OCR
    ocr_result = process_invoice(file_location)

    # ✅ SAVE OCR INTO DB (IMPORTANT)
    invoice = Invoice(
        filename=file.filename,
        file_path=file_location,
        user_id=user["id"],
        ocr_text=ocr_result.get("ocr_text"),
        extracted_fields=json.dumps(ocr_result.get("extracted_fields")),
    )

    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    # ✅ return OCR data to frontend
    return {
        "message": "Invoice uploaded successfully",
        **ocr_result,
    }


# =========================
# 📜 Invoice History (WITH OCR)
# =========================
@router.get("/history")
def invoice_history(
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    invoices = (
        db.query(Invoice)
        .filter(Invoice.user_id == user["id"])
        .order_by(Invoice.uploaded_at.desc())
        .all()
    )

    # ✅ FORMAT RESPONSE FOR FRONTEND
    result = []
    for inv in invoices:
        result.append({
            "id": inv.id,
            "filename": inv.filename,
            "uploaded_at": inv.uploaded_at,
            "ocr_text": inv.ocr_text,
            "extracted_fields": (
                json.loads(inv.extracted_fields)
                if inv.extracted_fields
                else {}
            ),
        })

    return result