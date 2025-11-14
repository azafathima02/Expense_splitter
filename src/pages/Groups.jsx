// src/pages/Groups.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaPlus, FaArrowRight, FaUserPlus } from "react-icons/fa";
import { motion } from "framer-motion";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [members, setMembers] = useState("");
  const [budget, setBudget] = useState("");
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Load logged user and fetch groups
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedUser) {
      setUser(loggedUser);
      fetchGroups(loggedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Fetch groups and filter only user's groups
  const fetchGroups = async (loggedUser) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/groups");
      const data = await res.json();

      const visibleGroups = data.filter((g) => {
        const members = g.members || [];
        const userName = (loggedUser.name || loggedUser.username || "").toLowerCase();
        const userId = String(loggedUser.id || "").toLowerCase();
        const isMember = members.some(
          (m) => String(m).toLowerCase() === userName || String(m).toLowerCase() === userId
        );
        const isCreator = String(g.createdBy) === String(loggedUser.id);
        return isMember || isCreator;
      });

      setGroups(visibleGroups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      alert("Error loading groups. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add a new group
  const handleAddGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || !groupDesc.trim()) {
      alert("Please fill all required fields");
      return;
    }

    const memberList = members
      .split(",")
      .map((m) => m.trim())
      .filter((m) => m);

    // Ensure creator is added to members list
    if (!memberList.includes(user.name)) {
      memberList.push(user.name);
    }

    const newGroup = {
      id: Date.now().toString(),
      name: groupName,
      description: groupDesc,
      members: memberList,
      createdBy: user.id || "",
      budget: budget ? parseFloat(budget) : 0,
    };

    try {
      const res = await fetch("http://localhost:3000/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGroup),
      });

      if (res.ok) {
        const addedGroup = await res.json();
        setGroups([...groups, addedGroup]);
        setGroupName("");
        setGroupDesc("");
        setMembers("");
        setBudget("");
        setShowForm(false);
        alert("Group created successfully! 🎉");
      } else {
        alert("Failed to create group. Please try again.");
      }
    } catch (error) {
      console.error("Error adding group:", error);
      alert("Error creating group. Please try again.");
    }
  };

  // ✅ Open group page
  const handleOpenGroup = (groupId) => {
    navigate(`/mygroup/${groupId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] text-white p-4 md:p-6 pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
              My Groups
            </h1>
            <p className="text-gray-400">Create and manage your expense groups</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg shadow-yellow-400/20 flex items-center gap-2"
          >
            <FaPlus />
            {showForm ? "Cancel" : "Create New Group"}
          </button>
        </div>

        {/* Create Group Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-yellow-400/30 rounded-2xl p-6 mb-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
              <FaUserPlus />
              Create New Group
            </h2>
            <form onSubmit={handleAddGroup} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Group Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Weekend Trip, Roommates, Office Team"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Description *</label>
                <textarea
                  placeholder="Describe the purpose of this group..."
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition resize-none"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Members</label>
                <input
                  type="text"
                  placeholder="Enter member names separated by commas (e.g., John, Jane, Bob)"
                  value={members}
                  onChange={(e) => setMembers(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition"
                />
                <p className="text-xs text-gray-500 mt-1">You will be automatically added as a member</p>
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Group Budget (₹)</label>
                <input
                  type="number"
                  placeholder="Enter total budget for this group (optional)"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition"
                  min="0"
                  step="0.01"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg"
              >
                Create Group
              </button>
            </form>
          </motion.div>
        )}

        {/* Display Groups */}
        {groups.length === 0 ? (
          <div className="bg-[#1A1A1A]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-12 text-center">
            <FaUsers className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No groups yet</p>
            <p className="text-gray-500 text-sm mb-4">Create your first group to start splitting expenses!</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all"
            >
              Create Your First Group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleOpenGroup(group.id)}
                className="cursor-pointer bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-gray-800 rounded-2xl p-6 hover:border-yellow-400/50 hover:shadow-xl hover:shadow-yellow-400/10 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-yellow-400 mb-2 group-hover:text-yellow-300 transition">
                      {group.name}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{group.description}</p>
                  </div>
                  <FaArrowRight className="text-gray-600 group-hover:text-yellow-400 transition transform group-hover:translate-x-1" />
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <FaUsers className="text-yellow-400/70" />
                  <span>
                    {group.members?.length || 0}{" "}
                    {group.members?.length === 1 ? "Member" : "Members"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
