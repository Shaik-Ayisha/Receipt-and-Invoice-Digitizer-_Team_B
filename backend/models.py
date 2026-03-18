from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


# ================= USER TABLE =================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)

    # hashed password storage
    hashed_password = Column(String, nullable=False)

    # ✅ relationship with invoices
    invoices = relationship("Invoice", back_populates="owner")


# ================= INVOICE TABLE =================
class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)

    # link invoice to user
    user_id = Column(Integer, ForeignKey("users.id"))

    # ✅ timestamp
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    # 🔥 NEW — STORE OCR RESULTS
    ocr_text = Column(Text, nullable=True)
    extracted_fields = Column(Text, nullable=True)  # stored as JSON string

    # relationship back to user
    owner = relationship("User", back_populates="invoices")