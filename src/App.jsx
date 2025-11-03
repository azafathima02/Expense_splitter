import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Expenses from "./pages/Expenses";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <div className="flex min-h-screen bg-gray-100">
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
            <div className="flex-1">
              <Navbar toggleSidebar={toggleSidebar} />
              <div className="p-4">
                <Dashboard />
              </div>
            </div>
          </div>
        }
      />
      <Route
        path="/expenses"
        element={
          <div className="flex min-h-screen bg-gray-100">
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
            <div className="flex-1">
              <Navbar toggleSidebar={toggleSidebar} />
              <div className="p-4">
                <Expenses />
              </div>
            </div>
          </div>
        }
      />
      {/* new route */}
    </Routes>
  );
}

export default App;
