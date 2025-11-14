import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ toggleSidebar }) => {
  const userName = "User";

  return (
    <header className="flex items-center justify-between h-16 bg-gray-800 border-b border-gray-700 px-4 md:px-6 shadow-xl sticky top-0 z-10">
      <div className="text-xl font-bold text-amber-400">SplitSmart</div>

      <div className="flex items-center space-x-4">
        {/* Hamburger menu (visible on mobile) */}
        <button
          className="md:hidden text-gray-300 hover:text-amber-400 transition duration-150"
          onClick={toggleSidebar}
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>

        {/* User profile */}
        <div className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-700 transition duration-150">
          <div className="text-sm font-medium hidden sm:block text-gray-200">
            Hello, {userName}!
          </div>

          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-400">
            <FontAwesomeIcon icon={faUserCircle} size="xl" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
