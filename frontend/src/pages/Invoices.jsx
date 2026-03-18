import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function Invoices() {

  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

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
        ocrText: inv.ocr_text,
        fields: typeof inv.extracted_fields === "string"
  ? JSON.parse(inv.extracted_fields)
  : inv.extracted_fields || {}
      }));

      setDocuments(formatted);

    } catch (err) {
      console.error("History fetch failed", err);
    }

  };


  // =========================
  // VIEW OCR TEXT
  // =========================
  const openOcrWindow = (text, name) => {

    const newWindow = window.open("", "_blank");

    newWindow.document.write(`
      <html>
        <head>
          <title>OCR Result - ${name}</title>
          <style>
            body { font-family: Arial; padding:20px }
            pre { white-space: pre-wrap }
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
  // DOWNLOAD PDF
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


  return (

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
                      onClick={() =>
                        downloadExtractedData(doc)
                      }
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

  );

}

export default Invoices;