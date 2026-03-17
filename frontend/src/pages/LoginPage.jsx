import React, { useState } from "react";
import invoiceImage from "./invoice-illustration.png";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    language: "English",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (page === "signup") {
  const response = await fetch("http://localhost:8000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      full_name: form.name,
      email: form.email,
      password: form.password,
    }),
  });

  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    alert(data.detail || "Registration failed");
    return;
  }

  alert("Registered successfully");
}
else {
  const params = new URLSearchParams();
  params.append("username", form.email);
  params.append("password", form.password);

  const response = await fetch("http://localhost:8000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    if (Array.isArray(data.detail)) {
      alert(data.detail.map(err => err.msg).join(", "));
    } else {
      alert(data.detail || "Login failed");
    }
    return;
  }

  // ✅ SUCCESS BLOCK
 localStorage.setItem("token", data.access_token);
navigate("/admin");   // ✅ redirect

}

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 p-10">

        {/* LEFT SIDE */}
        <div className="flex flex-col items-center justify-center text-black">
          <h1 className="text-5xl font-extrabold mb-8 text-center leading-tight">
            <span className="bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Receipt & Invoice
            </span>
            <br />
            <span className="text-slate-900 tracking-widest uppercase">
              Digitizer
            </span>
          </h1>

          <img
            src={invoiceImage}
            alt="Invoice Illustration"
            className="w-full max-w-md drop-shadow-xl"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-blue-50 rounded-2xl p-8 shadow-xl text-black">
          <h2 className="text-3xl font-bold text-center mb-2 text-blue-700 capitalize">
            {page}
          </h2>

          {page === "login" && (
            <p className="text-center text-sm text-gray-600 mb-4">
              First time here? Please register or sign up to continue.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {page === "signup" && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />

            {page === "signup" && (
              <select
                name="language"
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Telugu</option>
              </select>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              {page === "signup" ? "Create Account" : "Continue"}
            </button>
          </form>

          {/* GOOGLE OPTION */}
          

{/* GOOGLE LOGIN */}
<div className="mt-4 flex justify-center">

  <GoogleLogin
    onSuccess={(credentialResponse) => {
      try {

        const decoded = jwtDecode(credentialResponse.credential);

        console.log("Google user:", decoded);

        // store token
        localStorage.setItem("token", credentialResponse.credential);

        alert("Google Login Successful");

        navigate("/admin");

      } catch (error) {

        console.error(error);
        alert("Google login failed");

      }
    }}

    onError={() => {
      console.log("Google Login Failed");
      alert("Google login failed");
    }}

  />

</div>

          {/* SWITCH LINKS */}
          <div className="text-sm text-center text-gray-700 mt-4 space-y-1">
            {page !== "login" && (
              <p>
                Back to{" "}
                <button
                  onClick={() => setPage("login")}
                  className="text-blue-600 font-semibold"
                >
                  Login
                </button>
              </p>
            )}

            {page === "login" && (
              <>
                <p>
                  New user?{" "}
                  <button
                    onClick={() => setPage("signup")}
                    className="text-blue-600 font-semibold"
                  >
                    Sign Up
                  </button>
                </p>
                <p>
                  Already registered?{" "}
                  <button
                    onClick={() => setPage("signin")}
                    className="text-blue-600 font-semibold"
                  >
                    Sign In
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
