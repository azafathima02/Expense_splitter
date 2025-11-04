import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // for hamburger icons

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between bg-[#1C1C1C] px-6 py-4 shadow-lg z-50">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-[#FFC300]">SplitzSmart</h1>

      {/* Desktop Menu */}
      <nav className="hidden md:flex space-x-8 text-[#E0E0E0] font-medium">
        <a href="#" className="hover:text-[#FFC300]">About</a>
        <a href="#" className="hover:text-[#FFC300]">Groups</a>
        <a href="#" className="hover:text-[#FFC300]">Expenses</a>
        <a href="#" className="hover:text-[#FFC300]">Dashboard</a>
        <a href="#" className="hover:text-[#FFC300]">Login</a>
        <a href="#" className="hover:text-[#FFC300]">Signup</a>
      </nav>

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
          <a href="#" className="hover:text-[#FFC300]" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#" className="hover:text-[#FFC300]" onClick={() => setMenuOpen(false)}>Groups</a>
          <a href="#" className="hover:text-[#FFC300]" onClick={() => setMenuOpen(false)}>Expenses</a>
          <a href="#" className="hover:text-[#FFC300]" onClick={() => setMenuOpen(false)}>Dashboard</a>
          <a href="#" className="hover:text-[#FFC300]" onClick={() => setMenuOpen(false)}>Login</a>
          <a href="#" className="hover:text-[#FFC300]" onClick={() => setMenuOpen(false)}>Signup</a>
        </div>
      )}
    </header>
  );
};

export default Header;
