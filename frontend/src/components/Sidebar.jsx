import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-60 h-screen bg-gray-900 text-white p-6">

      <h1 className="text-xl font-bold mb-10">Admin Panel</h1>

      <ul className="space-y-6">

        <li>
          <Link to="/dashboard" className="hover:text-blue-400">
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/invoices" className="hover:text-blue-400">
            Invoices
          </Link>
        </li>

        <li>
          <Link to="/users" className="hover:text-blue-400">
            Users
          </Link>
        </li>

      </ul>

    </div>
  );
}