
# 📄 Receipt and Invoice Digitizer

The **Receipt and Invoice Digitizer** is a web-based application that automatically converts handwritten or printed receipts into structured digital data. The system uses **OCR (Optical Character Recognition)** to extract key details from receipt images and store them in a digital format for easy management and retrieval. 

This project was developed as part of the **Infosys Springboard Virtual Internship 6.0**.


# 🎯 Project Objective

The objective of this project is to reduce manual data entry by automatically extracting important information from receipts and invoices such as:

* Vendor Name
* Purchase Date
* Items Purchased
* Total Amount

The system also provides an **admin dashboard** to manage uploaded receipts and a **chatbot** that helps users interact with the system. 



# 🚀 Features

* 📤 Upload receipts and invoices
* 🔍 OCR-based text extraction using **Tesseract OCR**
* 📊 Admin dashboard for managing receipts
* 🤖 AI chatbot for user assistance
* 🌐 Multi-language receipt support
* 📈 Expense analytics dashboard
* 🌙 Light/Dark theme support
* 🔐 Secure login with JWT authentication
* 📂 Organized storage of digitized receipts



# 🛠️ Technologies Used

### Frontend

* React.js
* HTML / CSS
* JavaScript

### Backend

* Python
* FastAPI

### Database

* SQLite

### AI & OCR

* Tesseract OCR
* NLP using NLTK

### Other Tools

* Postman (API testing)
* GitHub (version control)
* VS Code (development environment)



# ⚙️ System Architecture

1. User uploads a receipt image.
2. Backend API receives the image.
3. Tesseract OCR extracts text from the image.
4. Extracted text is processed and converted into structured data.
5. Data is stored in the SQLite database.
6. Admin dashboard displays the digitized receipts.
7. Chatbot assists users with queries.



# 📂 Project Structure (Example)

```
receipt-invoice-digitizer
│
├── backend
│   ├── main.py
│   ├── ocr_processing.py
│   ├── database.py
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│
├── assets
├── README.md
└── requirements.txt


# ▶️ Installation and Setup

### 1️⃣ Clone the Repository

```bash
git clone <your-repository-link>
cd receipt-invoice-digitizer
```



### 2️⃣ Backend Setup

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the backend server:

```bash
uvicorn main:app --reload
```



### 3️⃣ Frontend Setup

Navigate to frontend folder:

```bash
cd frontend
npm install
npm start
```



# 📸 Application Workflow

1. Open the landing page.
2. Login using credentials or Google authentication.
3. Upload a receipt or invoice image.
4. System extracts data using OCR.
5. Extracted information is displayed in the dashboard.
6. Admin can manage and monitor uploaded receipts.



# ⚠️ Challenges Faced

* OCR accuracy issues with handwritten receipts
* Different receipt formats and layouts
* Poor image quality affecting text extraction
* Structuring raw OCR text into meaningful fields
* Integrating frontend, backend, and database
* Designing an intuitive user interface 



# 📚 Skills & Learning

Through this project we learned:

* OCR implementation using Python
* API development using FastAPI
* Full-stack development with React and Python
* Database design and integration
* Chatbot integration
* Testing and debugging
* Team collaboration and project management 



# 👥 Team Members

* Shaik Ayisha
* Srusti Yaligar
* Leela Krishna Kondapaturi



# Acknowledgements

We would like to thank **Infosys Springboard** for providing this internship opportunity and our mentor **Shakthi GopalKrishnan** for their guidance and support throughout the project.



# 📌 Internship Details

* **Program:** Infosys Springboard Virtual Internship 6.0
* **Project:** Receipt and Invoice Digitizer
* **Duration:** 8 Weeks


If you want, I can also give you a **much better GitHub README (with badges, screenshots section, and professional formatting)** so that your project looks **more impressive for recruiters and GitHub profile.**
