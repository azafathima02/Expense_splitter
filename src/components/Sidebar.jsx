import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/", iconClass: "fa-solid fa-house" },
  { name: "Groups", path: "/groups", iconClass: "fa-solid fa-users" },
  { name: "Expenses", path: "/expenses", iconClass: "fa-solid fa-wallet" },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-800 border-r border-gray-700 p-4 shadow-2xl h-screen">
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
            <i className={`${item.iconClass} w-6 h-6 mr-3`}></i>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-700">
        <button className="flex items-center w-full p-3 rounded-lg text-red-400 hover:bg-gray-700 transition duration-200">
          <i className="fa-solid fa-sign-out-alt w-6 h-6 mr-3"></i>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
