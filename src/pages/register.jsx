import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { registerUserAPI, getUsersAPI } from "../services/allAPI";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword)
      return alert("Please fill all fields!");
    if (password !== confirmPassword)
      return alert("Passwords do not match!");

    try {
      // Check if email already exists
      const { data: users } = await getUsersAPI();
      const existing = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (existing) {
        alert("Email already registered!");
        return;
      }

      // Register new user
      const newUser = { id: Date.now(), name, email, password };
      await registerUserAPI(newUser);
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      alert("Error creating account. Try again.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-[#0a0a0a] text-gray-100">
      <div className="absolute w-[300px] h-[300px] bg-yellow-500/20 rounded-full blur-3xl top-20 left-10 animate-floatSlow"></div>
      <div className="absolute w-[400px] h-[400px] bg-yellow-400/20 rounded-full blur-3xl bottom-20 right-10 animate-floatReverse"></div>

      <div className="relative z-10 w-[420px] p-10 bg-gradient-to-b from-[#1a1a1a]/80 to-black/60 backdrop-blur-2xl border border-yellow-500/20 rounded-2xl shadow-[0_0_25px_rgba(255,215,0,0.15)] animate-fadeInUp">
        <h1 className="text-4xl font-bold text-center mb-8 text-yellow-400 tracking-tight">
          Create Account
        </h1>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="relative">
            <FontAwesomeIcon icon={faUser} className="absolute left-3 top-3 text-yellow-400" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-yellow-400/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              required
            />
          </div>

          <div className="relative">
            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 text-yellow-400" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-yellow-400/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              required
            />
          </div>

          <div className="relative">
            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-yellow-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-yellow-400/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              required
            />
          </div>

          <div className="relative">
            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-yellow-400" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-yellow-400/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg text-black font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-all"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
