import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUsers,
  faWallet,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const navItems = [
  { name: "Dashboard", path: "/", icon: faHouse },
  { name: "Groups", path: "/groups", icon: faUsers },
  { name: "Expenses", path: "/expenses", icon: faWallet },
];

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div
      className={`md:flex flex-col w-64 bg-gray-800 border-r border-gray-700 p-4 shadow-2xl h-screen sticky top-0 z-20 ${
        isSidebarOpen ? "block" : "hidden"
      }`}
    >
      <div className="py-4 text-center text-2xl font-extrabold text-amber-400 border-b border-gray-700">
        SplitSmart
      </div>

      <nav className="flex-1 mt-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition duration-200 ${
                isActive
                  ? "bg-gray-700 text-amber-400 font-bold border-r-4 border-amber-400"
                  : "text-gray-300 hover:bg-gray-700 hover:text-amber-400"
              }`
            }
            end
          >
            <FontAwesomeIcon icon={item.icon} className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg text-red-400 hover:bg-gray-700 transition duration-200"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
