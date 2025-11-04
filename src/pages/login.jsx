import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { getUsersAPI } from "../services/allAPI";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Two allowed logins (email + password). Change these values if you want.
  const validUsers = [
    { email: "gopika@gmail.com", password: "1234" },
    { email: "aza@gmail.com", password: "1234" },
    { email: "sree@gmail.com", password: "1234" },
    { email: "amegh@gmail.com", password: "1234" },
  ];

  // ❌ Fix: add `async` before the function
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data: users } = await getUsersAPI();

      const foundUser = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );

      if (foundUser) {
       alert(`Welcome back, ${foundUser.name || "User"}!`);
localStorage.setItem("loggedInUser", JSON.stringify(foundUser)); // ✅ save user info
navigate("/dashboard");
      } else {
        // If API doesn’t find user, check local fallback validUsers
        const localUser = validUsers.find(
          (u) =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
        );
        if (localUser) {
          alert(`Welcome back, ${localUser.email}!`);
          navigate("/dashboard");
        } else {
          alert("Invalid email or password!");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Error logging in. Try again later.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-[#0a0a0a] text-gray-100">
      <div className="absolute w-[300px] h-[300px] bg-yellow-500/20 rounded-full blur-3xl top-20 left-10 animate-floatSlow"></div>
      <div className="absolute w-[400px] h-[400px] bg-yellow-400/20 rounded-full blur-3xl bottom-20 right-10 animate-floatReverse"></div>

      <div className="relative z-10 w-[400px] p-10 bg-gradient-to-b from-[#1a1a1a]/80 to-black/60 backdrop-blur-2xl border border-yellow-500/20 rounded-2xl shadow-[0_0_25px_rgba(255,215,0,0.15)] animate-fadeInUp">
        <h1 className="text-4xl font-bold text-center mb-8 text-yellow-400">
          Welcome Back
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <FontAwesomeIcon
              icon={faUser}
              className="absolute left-3 top-3 text-yellow-400"
            />
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
            <FontAwesomeIcon
              icon={faLock}
              className="absolute left-3 top-3 text-yellow-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-yellow-400/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg text-black font-semibold text-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-yellow-400 hover:text-yellow-300 font-medium transition duration-200"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
