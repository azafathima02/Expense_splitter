import React, { useState, useEffect, useRef } from "react";
import { Menu, X, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) setLoggedInUser(user);
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between bg-[#1C1C1C] px-6 py-4 shadow-lg z-50">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-[#FFC300]">SplitzSmart</h1>

      {/* Desktop Menu */}
      <nav className="hidden md:flex space-x-8 text-[#E0E0E0] font-medium">
        <Link to="/about" className="hover:text-[#FFC300]">About</Link>
        <Link to="/groups" className="hover:text-[#FFC300]">Groups</Link>
        <Link to="/expenses" className="hover:text-[#FFC300]">Expenses</Link>
        <Link to="/dashboard" className="hover:text-[#FFC300]">Dashboard</Link>
      </nav>

      {/* Right Side */}
      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        {loggedInUser ? (
          <>
            <p className="hidden md:block text-[#E0E0E0] font-medium">
              Hi, <span className="text-[#FFC300]">{loggedInUser.username}</span>
            </p>
            <div
              className="w-9 h-9 bg-[#FFC300] text-[#1C1C1C] rounded-full flex items-center justify-center cursor-pointer font-semibold"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
             {loggedInUser?.username ? loggedInUser.username[0].toUpperCase() : "U"}

            </div>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 bg-[#2A2A2A] border border-[#FFC300]/30 rounded-lg shadow-lg py-2 w-40">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-[#E0E0E0] hover:bg-[#FFC300]/20"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-[#E0E0E0] hover:bg-[#FFC300]/20"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <Link to="/login" className="text-[#FFC300] font-medium hover:underline">
            Login
          </Link>
        )}
      </div>

      {/* Hamburger Icon (Mobile) */}
      <div className="md:hidden">
        {menuOpen ? (
          <X
            className="text-[#FFC300] w-7 h-7 cursor-pointer"
            onClick={() => setMenuOpen(false)}
          />
        ) : (
          <Menu
            className="text-[#FFC300] w-7 h-7 cursor-pointer"
            onClick={() => setMenuOpen(true)}
          />
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#1C1C1C] flex flex-col items-center space-y-6 py-6 text-[#E0E0E0] font-medium md:hidden shadow-lg">
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/groups" onClick={() => setMenuOpen(false)}>Groups</Link>
          <Link to="/expenses" onClick={() => setMenuOpen(false)}>Expenses</Link>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          {loggedInUser ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Signup</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
