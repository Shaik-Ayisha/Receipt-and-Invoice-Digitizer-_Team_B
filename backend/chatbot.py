from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from google import genai
import os
from dotenv import load_dotenv

from auth import get_current_user
from database import SessionLocal
from models import Invoice

# Load environment variables
load_dotenv()

# Gemini client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

router = APIRouter()


# ---------- DB Dependency ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- Request Model ----------
class ChatRequest(BaseModel):
    message: str


# ---------- Chat Endpoint ----------
@router.post("/chat")
async def chat(
    request: ChatRequest,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        user_message = request.message.strip()

        # Fetch ONLY current user's latest invoice
        invoice = (
            db.query(Invoice)
            .filter(Invoice.user_id == user["id"])
            .order_by(Invoice.id.desc())
            .first()
        )

        invoice_context = "No invoices found for this user."

        if invoice:
            invoice_context = f"""
Latest Invoice:
File: {invoice.filename}
OCR Text: {invoice.ocr_text}
Extracted Fields: {invoice.extracted_fields}
"""

        prompt = f"""
You are an intelligent assistant for a Receipt & Invoice Digitizer system.

{invoice_context}

User Question:
{user_message}

Answer clearly and professionally.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return {"reply": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))