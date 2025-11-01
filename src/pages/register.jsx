import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert(`Account created for: ${name}`);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-[#0a0a0a] text-gray-100">
      {/* 🔆 Animated background glows */}
      <div className="absolute w-[300px] h-[300px] bg-yellow-500/20 rounded-full blur-3xl top-20 left-10 animate-floatSlow"></div>
      <div className="absolute w-[400px] h-[400px] bg-yellow-400/20 rounded-full blur-3xl bottom-20 right-10 animate-floatReverse"></div>

      {/* 💎 Glassmorphism Register Card */}
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
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-yellow-400/30 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
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
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-yellow-400/30 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
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
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-yellow-400/30 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
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
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-yellow-400/30 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 rounded-lg text-black font-semibold text-lg shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all duration-300 animate-buttonPulse"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-400 hover:text-yellow-300 font-medium transition duration-200"
          >
            Sign in here
          </Link>
        </p>
      </div>

      {/* ⚙️ Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out;
          }

          @keyframes floatSlow {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-25px) translateX(15px); }
          }
          .animate-floatSlow {
            animation: floatSlow 8s ease-in-out infinite;
          }

          @keyframes floatReverse {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(20px) translateX(-15px); }
          }
          .animate-floatReverse {
            animation: floatReverse 10s ease-in-out infinite;
          }

          @keyframes buttonPulse {
            0%, 100% { box-shadow: 0 0 12px rgba(255, 215, 0, 0.4); }
            50% { box-shadow: 0 0 24px rgba(255, 215, 0, 0.7); }
          }
          .animate-buttonPulse {
            animation: buttonPulse 2.5s infinite ease-in-out;
          }
        `}
      </style>
    </div>
  );
}
