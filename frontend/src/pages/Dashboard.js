import { useState , useEffect} from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "./Dashboard.css";
import Bot from "./Bot";

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [receiptLoading, setReceiptLoading] = useState(false);
const [invoiceLoading, setInvoiceLoading] = useState(false);
const fetchHistory = async () => {
  try {
    const response = await axios.get(
      "http://127.0.0.1:8000/invoice/history",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const formatted = response.data.map((inv) => ({
  name: inv.filename,
  type: "Invoice",
  date: new Date(inv.uploaded_at).toLocaleDateString(),
  status: "Uploaded",
  ocrText: inv.ocr_text,           // 🔥 CRITICAL
  fields: inv.extracted_fields || {},
}));

    setDocuments(formatted);
  } catch (err) {
    console.error("History fetch failed", err);
  }
};

useEffect(() => {
  fetchHistory();
}, []);
  

  // =========================
  // 🚀 COMMON UPLOAD FUNCTION
  // =========================
  const uploadToBackend = async (file, docType) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      if (docType === "Invoice") {
  setInvoiceLoading(true);
} else {
  setReceiptLoading(true);
}

      const endpoint =
  docType === "Invoice"
    ? "http://127.0.0.1:8000/invoice/upload"
    : "http://127.0.0.1:8000/upload-receipt";

const response = await axios.post(endpoint, formData, {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
const newDoc = {
  name: file.name,
  type: docType,
  date: new Date().toLocaleDateString(),
  status: docType === "Invoice" ? "Uploaded" : "Processed",
  ocrText: response.data.ocr_text,
  fields: response.data.extracted_fields,
};
      if (docType === "Receipt") {
  setDocuments((prev) => [...prev, newDoc]);
}

      if (docType === "Invoice") {
  fetchHistory();
}
    } catch (error) {
      console.error(error);

      const failedDoc = {
        name: file.name,
        type: docType,
        date: new Date().toLocaleDateString(),
        status: "Failed",
        ocrText: "",
        fields: {},
      };

      setDocuments((prev) => [...prev, failedDoc]);
      alert("Upload failed");
    } finally {
      if (docType === "Invoice") {
  setInvoiceLoading(false);
} else {
  setReceiptLoading(false);
}
    }
  };

  // =========================
  // 📁 Upload Handlers
  // =========================
  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (file) uploadToBackend(file, "Receipt");
  };

  const handleInvoiceUpload = (e) => {
    const file = e.target.files[0];
    if (file) uploadToBackend(file, "Invoice");
  };

  // =========================
  // 🪟 VIEW OCR WINDOW
  // =========================
  const openOcrWindow = (text, name) => {
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
      <html>
        <head>
          <title>OCR Result - ${name}</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            pre { white-space: pre-wrap; word-wrap: break-word; }
          </style>
        </head>
        <body>
          <h2>Extracted Text</h2>
          <pre>${text || "No text found"}</pre>
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  // =========================
  // 📄 DOWNLOAD AS PDF
  // =========================
  const downloadExtractedData = (doc) => {
    const pdf = new jsPDF();

    let y = 15;

    pdf.setFontSize(16);
    pdf.text("Receipt & Invoice Digitizer", 14, y);
    y += 10;

    pdf.setFontSize(12);
    pdf.text(`File Name: ${doc.name}`, 14, y);
    y += 7;
    pdf.text(`Type: ${doc.type}`, 14, y);
    y += 7;
    pdf.text(`Date: ${doc.date}`, 14, y);
    y += 10;

    pdf.setFontSize(13);
    pdf.text("Extracted Fields:", 14, y);
    y += 8;

    pdf.setFontSize(10);

    const fieldsText = JSON.stringify(doc.fields, null, 2);
    const splitFields = pdf.splitTextToSize(fieldsText, 180);
    pdf.text(splitFields, 14, y);
    y += splitFields.length * 5 + 5;

    pdf.setFontSize(13);
    pdf.text("Full OCR Text:", 14, y);
    y += 8;

    pdf.setFontSize(10);
    const splitOcr = pdf.splitTextToSize(doc.ocrText || "No text found", 180);
    pdf.text(splitOcr, 14, y);

    pdf.save(`${doc.name}_extracted.pdf`);
  };

  // =========================
  // 📊 Stats
  // =========================
  const totalDocs = documents.length;
  const receiptsCount = documents.filter(d => d.type === "Receipt").length;
  const invoicesCount = documents.filter(d => d.type === "Invoice").length;
  const pendingCount = documents.filter(d => d.status === "Uploaded").length;

  return (
  <div className="dashboard-container">
    {/* Main Content */}
    <div className="main-content">
      {/* Header */}
      <div className="header">
        <div className="welcome-text">
          <h1>Welcome back 👋</h1>
          <p>Centralized management for digitizing receipts and invoices.</p>
        </div>
        <div className="Home">Home</div>
      </div>

      {/* Summary Cards */}
      <div className="cards">
        <div className="card">
          <h3>📊Total Documents</h3>
          <p>{totalDocs}</p>
        </div>
        <div className="card">
          <h3>📑Receipts Uploaded</h3>
          <p>{receiptsCount}</p>
        </div>
        <div className="card">
          <h3>📄Invoices Uploaded</h3>
          <p>{invoicesCount}</p>
        </div>
        <div className="card">
          <h3>⏳Pending OCR</h3>
          <p>{pendingCount}</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="upload-section">
        <div className="upload-box">
          <h3>Upload Receipt</h3>
          <p>Drag & drop or click to upload receipt</p>

          <input
            type="file"
            id="receiptInput"
            style={{ display: "none" }}
            onChange={handleReceiptUpload}
          />

          <button
            onClick={() =>
              document.getElementById("receiptInput").click()
            }
            disabled={receiptLoading}
          >
            {receiptLoading ? "Processing..." : "Upload Receipt"}
          </button>
        </div>

        <div className="upload-box">
          <h3>Upload Invoice</h3>
          <p>Drag & drop or click to upload invoice</p>

          <input
            type="file"
            id="invoiceInput"
            style={{ display: "none" }}
            onChange={handleInvoiceUpload}
          />

          <button
            onClick={() =>
              document.getElementById("invoiceInput").click()
            }
            disabled={invoiceLoading}
          >
            {invoiceLoading ? "Processing..." : "Upload Invoice"}
          </button>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="recent-docs">
        <h3>Recent Documents</h3>
        <table>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Extracted Text</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan="6">No documents yet</td>
              </tr>
            ) : (
              documents.map((doc, index) => (
                <tr key={index}>
                  <td>{doc.name}</td>
                  <td>{doc.type}</td>
                  <td>{doc.date}</td>
                  <td>{doc.status}</td>

                  <td>
                    {doc.ocrText ? (
                      <button
                        onClick={() =>
                          openOcrWindow(doc.ocrText, doc.name)
                        }
                      >
                        View Text
                      </button>
                    ) : "—"}
                  </td>

                  <td>
                    {doc.ocrText ? (
                      <button
                        onClick={() => downloadExtractedData(doc)}
                      >
                        Download PDF
                      </button>
                    ) : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* ✅ Chatbot Component */}
    <Bot />
  </div>
);
}
export default Dashboard;