import { useEffect, useState } from "react";
import axios from "axios";

function Users() {

  const [users, setUsers] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchInvoices();
  }, []);

  const fetchUsers = async () => {
    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/users",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUsers(res.data);

    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchInvoices = async () => {
    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/invoice/history",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setInvoiceData(res.data);

    } catch (err) {
      console.error("Failed to fetch invoices", err);
    }
  };

  const deleteUser = async (id) => {

    if (!window.confirm("Delete this user?")) return;

    try {

      await axios.delete(
        `http://127.0.0.1:8000/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUsers(users.filter(u => u.id !== id));

    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // calculate invoices per user
  const getUserInvoiceCount = (userId) => {
    return invoiceData.filter(inv => inv.user_id === userId).length;
  };

  // calculate revenue per user
  const getUserRevenue = (userId) => {

  const userInvoices = invoiceData.filter(inv => inv.user_id === userId);

  let total = 0;

  userInvoices.forEach(inv => {

    if (!inv.extracted_fields) return;

    let fields = {};

    try {

      // if string → parse
      if (typeof inv.extracted_fields === "string") {
        fields = JSON.parse(inv.extracted_fields);
      } 
      // if already object → use directly
      else {
        fields = inv.extracted_fields;
      }

      total += parseFloat(fields.total || 0);

    } catch (err) {
      console.warn("Invalid extracted_fields format", inv.extracted_fields);
    }

  });

  return `$${total.toFixed(2)}`;
};

  return (

    <div style={{ padding: "40px" }}>

      <h3 style={{ marginBottom: "25px" }}>
        Users Management
      </h3>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
        }}
      >

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #e5e7eb",
          }}
        >

          <thead style={{ background: "#f9fafb" }}>
            <tr>

              <th style={{ padding: "14px", border: "1px solid #e5e7eb" }}>
                Email
              </th>

              <th style={{ padding: "14px", border: "1px solid #e5e7eb" }}>
                Invoices
              </th>

              <th style={{ padding: "14px", border: "1px solid #e5e7eb" }}>
                Revenue
              </th>

              <th style={{ padding: "14px", border: "1px solid #e5e7eb", textAlign:"center" }}>
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {users.length === 0 ? (

              <tr>
                <td colSpan="4" style={{ textAlign:"center", padding:"20px" }}>
                  No users found
                </td>
              </tr>

            ) : (

              users.map((u) => (

                <tr key={u.id}>

                  <td style={{ padding:"14px", border:"1px solid #e5e7eb" }}>
                    {u.email}
                  </td>

                  <td style={{ padding:"14px", border:"1px solid #e5e7eb" }}>
                    {getUserInvoiceCount(u.id)}
                  </td>

                  <td style={{ padding:"14px", border:"1px solid #e5e7eb" }}>
                    {getUserRevenue(u.id)}
                  </td>

                  <td style={{ padding:"14px", border:"1px solid #e5e7eb", textAlign:"center" }}>

                    <button
                      style={{
                        marginRight: "10px",
                        padding: "7px 14px",
                        border: "none",
                        borderRadius: "6px",
                        background: "#2563eb",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => deleteUser(u.id)}
                      style={{
                        padding: "7px 14px",
                        border: "none",
                        borderRadius: "6px",
                        background: "#ef4444",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      🗑 Delete
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default Users;