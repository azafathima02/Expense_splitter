import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Groups() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState("");
  const [groups, setGroups] = useState([]);

  const navigate = useNavigate();

  const addMember = () => {
    if (newMember.trim()) {
      setMembers([...members, newMember.trim()]);
      setNewMember("");
    }
  };

  const handleGroupSubmit = () => {
    if (groupName.trim()) {
      setGroups([
        ...groups,
        { name: groupName, desc: groupDesc, members },
      ]);
      setShowCreateModal(false);
      setGroupName("");
      setGroupDesc("");
      setMembers([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      

      {/* Main Content */}
      <main className="pt-24 px-6">
        {/* Create Group Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#FFC300] text-[#0A0A0A] font-semibold py-3 px-8 rounded-xl shadow hover:bg-yellow-400 transition"
          >
            + Create Group
          </button>
        </div>

        {/* Groups Grid */}
        {groups.length === 0 ? (
          <p className="text-center text-[#E0E0E0] italic">
            No groups created yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group, index) => (
              <div
                key={index}
                onClick={() => navigate("/mygroup", { state: { group } })}
                className="bg-[#1C1C1C] border border-[#333] rounded-lg p-4 cursor-pointer hover:scale-105 hover:shadow-lg transition-transform"
              >
                <h3 className="text-lg font-semibold text-[#FFC300] mb-2">
                  {group.name}
                </h3>
                <p className="text-[#E0E0E0] text-sm">{group.desc || "No description provided."}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-[#1C1C1C] rounded-xl shadow-xl p-6 w-96 relative border border-[#333]">
            <h2 className="text-xl font-semibold mb-4 text-center text-[#FFC300]">
              Create New Group
            </h2>

            <label className="block mb-2 text-sm font-medium text-[#E0E0E0]">
              Group Name
            </label>
            <input
              type="text"
              className="w-full bg-[#0A0A0A] border border-[#333] rounded px-3 py-2 mb-3 text-white focus:outline-none focus:ring-1 focus:ring-[#FFC300]"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />

            <label className="block mb-2 text-sm font-medium text-[#E0E0E0]">
              Description
            </label>
            <textarea
              className="w-full bg-[#0A0A0A] border border-[#333] rounded px-3 py-2 mb-3 text-white focus:outline-none focus:ring-1 focus:ring-[#FFC300]"
              rows="3"
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
              placeholder="Enter group description"
            />

            <button
              onClick={() => setShowMemberModal(true)}
              className="bg-[#FFC300] text-[#0A0A0A] px-4 py-2 rounded w-full mb-3 font-medium hover:bg-yellow-400"
            >
              Add Members
            </button>

            <div className="flex justify-between">
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#E0E0E0] hover:text-[#FFC300]"
              >
                Cancel
              </button>
              <button
                onClick={handleGroupSubmit}
                className="bg-[#FFC300] text-[#0A0A0A] px-4 py-2 rounded font-semibold hover:bg-yellow-400"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Members Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-[#1C1C1C] rounded-xl shadow-xl p-6 w-96 relative border border-[#333]">
            <h2 className="text-xl font-semibold mb-4 text-center text-[#FFC300]">
              Add Members
            </h2>

            <div className="flex mb-3">
              <input
                type="text"
                className="flex-grow bg-[#0A0A0A] border border-[#333] rounded-l px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#FFC300]"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                placeholder="Enter member name or email"
              />
              <button
                onClick={addMember}
                className="bg-[#FFC300] text-[#0A0A0A] px-3 rounded-r font-semibold hover:bg-yellow-400"
              >
                Add
              </button>
            </div>

            <ul className="mb-4 max-h-32 overflow-y-auto border border-[#333] rounded p-2 text-sm">
              {members.length === 0 ? (
                <li className="text-[#E0E0E0] italic">No members added yet</li>
              ) : (
                members.map((m, index) => (
                  <li key={index} className="border-b border-[#333] py-1 text-[#E0E0E0]">
                    {m}
                  </li>
                ))
              )}
            </ul>

            <div className="flex justify-between">
              <button
                onClick={() => setShowMemberModal(false)}
                className="text-[#E0E0E0] hover:text-[#FFC300]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
