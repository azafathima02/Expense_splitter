import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Groups from "./pages/Groups";
import Header from "./components/Header";
import MyGroup from "./pages/MyGroups";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AddExpense from "./pages/AddExpense"; // ✅ import added

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/mygroup/:id" element={<MyGroup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/mygroup/:id/addexpense" element={<AddExpense />} />

      </Routes>
    </>
  );
}

export default App;
