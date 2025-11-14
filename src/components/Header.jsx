import React, { useState, useEffect, useRef } from "react";
import { Menu, X, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-gray-800 text-white flex justify-between items-center px-6 py-3 shadow-md">
      <Link to="/dashboard" className="text-xl font-bold">
        Expense Splitter
      </Link>

      <nav className="hidden md:flex gap-6">
        <Link to="/dashboard" className="hover:text-gray-300">
          Dashboard
        </Link>
        <Link to="/groups" className="hover:text-gray-300">
          Groups
        </Link>
        <Link to="/profile" className="hover:text-gray-300">
          Profile
        </Link>
        <Link to="/expenses" className="hover:text-gray-300">
          Expenses
        </Link>
        <Link to="/about" className="hover:text-gray-300">
          About
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        {currentUser && (
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-200">
            <User size={18} />
            <span>Hello, {currentUser.name || currentUser.username || "User"}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm"
        >
          Logout
        </button>

        <button onClick={toggleMenu} className="md:hidden">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-16 right-4 bg-gray-700 text-white p-4 rounded-lg shadow-lg flex flex-col gap-3 md:hidden"
        >
          <Link to="/dashboard" onClick={toggleMenu}>
            Dashboard
          </Link>
          <Link to="/groups" onClick={toggleMenu}>
            Groups
          </Link>
          <Link to="/profile" onClick={toggleMenu}>
            Profile
          </Link>
          <Link to="/expenses" onClick={toggleMenu}>
            Expenses
          </Link>
          <Link to="/about" onClick={toggleMenu}>
            About
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </header>
  );
};

export default Header;
