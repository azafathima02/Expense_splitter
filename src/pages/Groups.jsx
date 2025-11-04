// src/pages/Groups.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [groupBudget, setGroupBudget] = useState("");
  const [members, setMembers] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Load logged user and fetch groups
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedUser) {
      setUser(loggedUser);
      fetchGroups();
    }
  }, []);

  // ✅ Fetch groups from JSON Server
  const fetchGroups = async () => {
    try {
      const res = await fetch("http://localhost:5001/groups");
      const data = await res.json();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  // ✅ Add a new group
  const handleAddGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || !groupDesc.trim() || !groupBudget.trim()) {
      alert("Please fill all fields");
      return;
    }

    const memberList = members
      .split(",")
      .map((m) => m.trim())
      .filter((m) => m);

    const newGroup = {
      id: Date.now().toString(),
      name: groupName,
      description: groupDesc,
      budget: parseFloat(groupBudget),
      members: [user?.name || user?.username || "Unknown", ...memberList],
      createdBy: user?.id || "",
      expenses: [],
    };

    try {
      const res = await fetch("http://localhost:5001/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGroup),
      });

      if (res.ok) {
        setGroups([...groups, newGroup]);
        setGroupName("");
        setGroupDesc("");
        setGroupBudget("");
        setMembers("");
      }
    } catch (error) {
      console.error("Error adding group:", error);
    }
  };

  // ✅ Open group chat
  const handleOpenGroup = (groupId) => {
    navigate(`/mygroup/${groupId}`);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 pt-[70px]">
      <h1 className="text-3xl font-bold mb-4">My Groups</h1>

      {/* Create Group Form */}
      <form
        onSubmit={handleAddGroup}
        className="bg-[#1A1A1A] p-4 rounded-2xl mb-6 shadow-md"
      >
        <h2 className="text-xl font-semibold mb-3 text-[#FFC300]">
          Create New Group
        </h2>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full p-2 mb-2 rounded bg-[#0A0A0A] text-white"
        />
        <input
          type="text"
          placeholder="Description"
          value={groupDesc}
          onChange={(e) => setGroupDesc(e.target.value)}
          className="w-full p-2 mb-2 rounded bg-[#0A0A0A] text-white"
        />
        <input
          type="number"
          placeholder="Group Budget (₹)"
          value={groupBudget}
          onChange={(e) => setGroupBudget(e.target.value)}
          className="w-full p-2 mb-2 rounded bg-[#0A0A0A] text-white"
        />
        <input
          type="text"
          placeholder="Members (comma separated)"
          value={members}
          onChange={(e) => setMembers(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-[#0A0A0A] text-white"
        />
        <button
          type="submit"
          className="bg-[#FFC300] text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
        >
          Add Group
        </button>
      </form>

      {/* Display Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.length > 0 ? (
          groups.map((g) => (
            <div
              key={g.id}
              onClick={() => handleOpenGroup(g.id)}
              className="cursor-pointer bg-[#1A1A1A] hover:bg-[#222] p-4 rounded-2xl shadow-md transition"
            >
              <h3 className="text-xl font-bold text-[#FFC300]">{g.name}</h3>
              <p className="text-gray-400">{g.description}</p>
              <p className="text-sm mt-2 text-gray-500">
                Budget: ₹{g.budget?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-gray-500">
                Members: {g.members?.length || 0}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No groups created yet.</p>
        )}
      </div>
    </div>
  );
};

export default Groups;
