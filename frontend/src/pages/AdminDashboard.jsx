import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import RevenueChart from "../components/RevenueChart";
import VendorChart from "../components/VendorChart";

export default function AdminDashboard() {

  const [recentUploads, setRecentUploads] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchRecentUploads();
  }, []);

  const fetchRecentUploads = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/invoice/history",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const formatted = response.data.map((inv) => {

        let fields = {};

        // 🔹 SAFE PARSE
        if (inv.extracted_fields) {

          if (typeof inv.extracted_fields === "string") {
            try {
              fields = JSON.parse(inv.extracted_fields);
            } catch {
              fields = {};
            }
          } else {
            fields = inv.extracted_fields;
          }

        }

        return {
          id: inv.id,
          filename: inv.filename || "Unknown file",
          vendor: fields.vendor || "Unknown",
          date: inv.uploaded_at
            ? new Date(inv.uploaded_at).toLocaleDateString()
            : "—",
          amount: `$${parseFloat(fields.total || 0).toFixed(2)}`,
          status: "Processed"
        };

      });

      setRecentUploads(formatted);

    } catch (error) {
      console.error("Upload fetch failed", error);
    }

  };

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-64">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">

        {/* Toggle Sidebar */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          {sidebarOpen ? "Hide Admin Panel ◀" : "Show Admin Panel ▶"}
        </button>

        <h1 className="text-3xl font-bold mb-8">
          Admin Dashboard
        </h1>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">

          <h2 className="text-lg font-semibold mb-4">
            Revenue Overview
          </h2>

          <div className="w-full h-[420px]">
            <RevenueChart />
          </div>

        </div>

        {/* Vendor Pie Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">

          <h2 className="text-lg font-semibold mb-4">
            Top Vendors
          </h2>

          <div className="w-full h-[380px] flex items-center justify-center">
            <VendorChart />
          </div>

        </div>

        {/* Recent Uploads */}
        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-lg font-semibold mb-6">
            Recent Uploads
          </h2>

          <table className="w-full border border-gray-200">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">File</th>
                <th className="p-3 border">Vendor</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>

            <tbody>

              {recentUploads.length === 0 ? (

                <tr>
                  <td colSpan="5" className="text-center p-4">
                    No uploads yet
                  </td>
                </tr>

              ) : (

                recentUploads.map((item) => (

                  <tr key={item.id} className="hover:bg-gray-50">

                    <td className="p-3 border">{item.filename}</td>
                    <td className="p-3 border">{item.vendor}</td>
                    <td className="p-3 border">{item.date}</td>
                    <td className="p-3 border">{item.amount}</td>

                    <td className="p-3 border text-green-600 font-medium">
                      {item.status}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}