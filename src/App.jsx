import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Expenses from "./pages/Expenses";
import Groups from "./pages/Groups";
import Header from "./components/Header";
import MyGroup from "./pages/MyGroups";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/mygroup" element={<MyGroup />} />
      </Routes>
    </>
  );
}

export default App;
