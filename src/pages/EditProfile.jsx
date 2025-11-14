import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaSave, FaTimes, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      // Update localStorage
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      
      alert("Profile updated successfully! ✅");
      
      // Navigate to profile page which will refetch data
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] text-white pt-20 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/profile")}
            className="mb-4 flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition"
          >
            <FaArrowLeft />
            Back to Profile
          </button>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
            Edit Profile
          </h1>
          <p className="text-gray-400">Update your account information</p>
        </div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl"
        >
          <form onSubmit={handleSave} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-gray-300 mb-2 font-semibold flex items-center gap-2">
                <FaUser className="text-yellow-400" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={user.name || user.username || ""}
                onChange={handleChange}
                className="w-full p-4 rounded-lg bg-[#0A0A0A] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-gray-300 mb-2 font-semibold flex items-center gap-2">
                <FaEnvelope className="text-yellow-400" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={user.email || ""}
                onChange={handleChange}
                className="w-full p-4 rounded-lg bg-[#0A0A0A] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* User ID (Read-only) */}
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">User ID</label>
              <input
                type="text"
                value={user.id}
                disabled
                className="w-full p-4 rounded-lg bg-[#0A0A0A] border border-gray-800 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">User ID cannot be changed</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 px-6 py-4 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2"
              >
                <FaTimes />
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfile;
