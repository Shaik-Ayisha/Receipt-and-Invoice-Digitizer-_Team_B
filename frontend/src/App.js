import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Users from "./pages/Users";

function App() {
return ( <Router> <Routes>


    <Route path="/" element={<LoginPage />} />

    <Route path="/admin" element={<AdminDashboard />} />

    <Route path="/dashboard" element={<Dashboard />} />

    <Route path="/invoices" element={<Invoices />} />

    <Route path="/users" element={<Users />} />

  </Routes>
</Router>

);
}

export default App;
