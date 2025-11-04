import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // start as null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/login");
    } else {
      setUser(loggedInUser);
    }
    setLoading(false);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5001/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      localStorage.setItem("loggedInUser", JSON.stringify(user));
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading || !user) {
    return (
      <p className="text-center mt-20 text-gray-300 text-lg">
        Loading profile...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex justify-center items-center">
      <div className="bg-[#1C1C1C] p-8 rounded-2xl shadow-lg border border-[#FFC300]/30 w-96">
        <h1 className="text-2xl font-bold text-[#FFC300] mb-6 text-center">
          Edit Profile
        </h1>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block mb-1 text-[#FFC300]">Username</label>
            <input
              type="text"
              name="username"
              value={user.username || ""}
              onChange={handleChange}
              className="w-full bg-[#2A2A2A] p-2 rounded-md text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-[#FFC300]">Email</label>
            <input
              type="email"
              name="email"
              value={user.email || ""}
              onChange={handleChange}
              className="w-full bg-[#2A2A2A] p-2 rounded-md text-white outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#FFC300] text-black py-2 rounded-lg font-semibold hover:bg-[#FFD633]"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-full bg-gray-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-600"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
