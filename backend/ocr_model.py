import cv2
import pytesseract
import re
import os
from PIL import Image
import numpy as np

# 🔥 Keep for Windows safety
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


# =========================
# Image Preprocessing
# =========================
def preprocess_image(image_path: str):
    """
    Preprocess invoice image to improve OCR accuracy
    """
    img = cv2.imread(image_path)

    if img is None:
        raise ValueError("Unable to read image")

    # 1️⃣ grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 2️⃣ upscale (important for receipts)
    gray = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

    # 3️⃣ light blur
    blur = cv2.GaussianBlur(gray, (3, 3), 0)

    # 4️⃣ OTSU threshold
    _, processed = cv2.threshold(
        blur,
        0,
        255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )

    return processed


# =========================
# OCR Extraction
# =========================
def run_ocr(image_path: str) -> str:
    """
    Run Tesseract OCR on the image
    """
    processed = preprocess_image(image_path)

    custom_config = r'--oem 3 --psm 6'
    text = pytesseract.image_to_string(processed, config=custom_config)

    return text.strip()


# =========================
# Field Extraction
# =========================
import re

def extract_fields(text: str) -> dict:
    """
    Smart field extractor bot
    """
    data = {}
    text_lower = text.lower()

    # ======================
    # 📅 DATE
    # ======================
    date_patterns = [
        r'\d{2}[/-]\d{2}[/-]\d{2,4}',
        r'\d{4}[/-]\d{2}[/-]\d{2}'
    ]

    for pattern in date_patterns:
        match = re.search(pattern, text)
        if match:
            data["date"] = match.group()
            break

    # ======================
    # 💰 TOTAL (robust)
    # ======================
    total_patterns = [
        r'(total|t0tal|qotal|amount)[^\d]{0,15}(\d+\.\d{2})',
        r'\b(\d+\.\d{2})\b'
    ]

    for pattern in total_patterns:
        match = re.search(pattern, text_lower)
        if match:
            data["total"] = match.group(2) if match.lastindex else match.group(1)
            break

    # ======================
    # 🧾 INVOICE NUMBER
    # ======================
    inv_patterns = [
        r'(invoice\s*no|inv\s*no|bill\s*no)[^\w]*(\w+)',
        r'(transaction\s*#)[^\w]*(\w+)'
    ]

    for pattern in inv_patterns:
        match = re.search(pattern, text_lower, re.IGNORECASE)
        if match:
            data["invoice_no"] = match.group(2)
            break

    # ======================
    # 🏪 VENDOR (simple heuristic)
    # ======================
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    if lines:
        data["vendor"] = lines[0][:50]  # first line heuristic

    return data
# =========================
# Main pipeline (BEST PRACTICE)
# =========================
def process_invoice(image_path: str) -> dict:
    """
    Complete pipeline:
    image → OCR → structured data
    """
    if not os.path.exists(image_path):
        raise FileNotFoundError("Image not found")

    text = run_ocr(image_path)
    fields = extract_fields(text)

    return {
        "ocr_text": text,
        "extracted_fields": fields
    }