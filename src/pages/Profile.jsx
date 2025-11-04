import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch logged in user
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/login");
    } else {
      setUser(loggedInUser);
      fetchUserData(loggedInUser.id);
    }
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      const [expensesRes, groupsRes] = await Promise.all([
        fetch(`http://localhost:5001/expenses?userId=${userId}`),
        fetch(`http://localhost:5001/groups?members_like=${userId}`),
      ]);

      const expensesData = await expensesRes.json();
      const groupsData = await groupsRes.json();

      setExpenses(expensesData);
      setGroups(groupsData);
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  if (!user) return <p className="text-center mt-20 text-gray-300">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-24 px-6">
      <div className="max-w-4xl mx-auto bg-[#1C1C1C] p-8 rounded-2xl shadow-lg border border-[#FFC300]/30">
        <h1 className="text-3xl font-bold text-[#FFC300] mb-6">My Profile</h1>

        {/* User Details */}
        <div className="space-y-4">
          <p><span className="font-semibold text-[#FFC300]">Username:</span> {user.username}</p>
          <p><span className="font-semibold text-[#FFC300]">Email:</span> {user.email}</p>
          <p><span className="font-semibold text-[#FFC300]">User ID:</span> {user.id}</p>
        </div>

        {/* Divider */}
        <hr className="my-6 border-[#FFC300]/30" />

        {/* Groups Joined */}
        <div>
          <h2 className="text-2xl font-semibold text-[#FFC300] mb-3">Groups Joined</h2>
          {groups.length > 0 ? (
            <ul className="space-y-2">
              {groups.map((group) => (
                <li key={group.id} className="bg-[#2A2A2A] p-3 rounded-md">
                  <p className="font-semibold">{group.name}</p>
                  <p className="text-sm text-gray-400">{group.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No groups joined yet.</p>
          )}
        </div>

        {/* Divider */}
        <hr className="my-6 border-[#FFC300]/30" />

        {/* Expense History */}
        <div>
          <h2 className="text-2xl font-semibold text-[#FFC300] mb-3">Expense History</h2>
          {expenses.length > 0 ? (
            <ul className="space-y-2">
              {expenses.map((exp) => (
                <li key={exp.id} className="bg-[#2A2A2A] p-3 rounded-md flex justify-between">
                  <p>{exp.title}</p>
                  <p className="text-[#FFC300] font-medium">₹{exp.amount}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No expenses recorded yet.</p>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigate("/edit-profile")}
            className="bg-[#FFC300] text-black px-5 py-2 rounded-lg font-semibold hover:bg-[#FFD633]"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
