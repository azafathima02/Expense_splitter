import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaIdCard, FaUsers, FaMoneyBillWave, FaEdit, FaSignOutAlt, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch logged in user
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/login");
    } else {
      setUser(loggedInUser);
      fetchUserData(loggedInUser);
    }
  }, [navigate]);

  // Refetch when user changes (after edit)
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser && user) {
      setUser(loggedInUser);
      fetchUserData(loggedInUser);
    }
  }, []);

  const fetchUserData = async (loggedInUser) => {
    setLoading(true);
    try {
      // Fetch all expenses and groups, then filter client-side
      const [expensesRes, groupsRes] = await Promise.all([
        fetch(`http://localhost:3000/expenses`),
        fetch(`http://localhost:3000/groups`),
      ]);

      const expensesData = await expensesRes.json();
      const groupsData = await groupsRes.json();

      // Get user identifiers
      const userName = loggedInUser.name || loggedInUser.username;
      const userId = String(loggedInUser.id);

      // Filter expenses where user is a member
      const userExpenses = expensesData.filter((exp) => {
        const members = exp.members || [];
        return members.some((m) => {
          const memberStr = String(m);
          return memberStr === userId || memberStr === userName || m === userName;
        });
      });

      // Filter groups where user is a member
      const userGroups = groupsData.filter((group) => {
        const members = group.members || [];
        return members.some((m) => {
          const memberStr = String(m);
          return memberStr === userId || memberStr === userName || m === userName;
        });
      });

      setExpenses(userExpenses);
      setGroups(userGroups);
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("loggedInUser");
      navigate("/login");
    }
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] text-white pt-20 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
            My Profile
          </h1>
          <p className="text-gray-400">Manage your account and view your activity</p>
        </div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-gray-800 rounded-2xl p-6 md:p-8 mb-6 shadow-xl"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-3xl font-bold text-black">
                {(user.name || user.username || "U")[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-yellow-400 mb-1">
                  {user.name || user.username || "User"}
                </h2>
                <p className="text-gray-400 flex items-center gap-2">
                  <FaEnvelope className="text-yellow-400/70" />
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/edit-profile")}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition flex items-center gap-2"
              >
                <FaEdit />
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <FaIdCard className="text-yellow-400 text-xl" />
              <div>
                <p className="text-gray-400 text-sm">User ID</p>
                <p className="text-white font-semibold">{user.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaUsers className="text-blue-400 text-xl" />
              <div>
                <p className="text-gray-400 text-sm">Groups</p>
                <p className="text-white font-semibold">{groups.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaMoneyBillWave className="text-green-400 text-xl" />
              <div>
                <p className="text-gray-400 text-sm">Total Spent</p>
                <p className="text-white font-semibold">₹{totalSpent.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Groups Joined */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-gray-800 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <FaUsers />
              Groups Joined ({groups.length})
            </h2>
            {groups.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-[#0A0A0A] border border-gray-800 rounded-xl p-4 hover:border-yellow-400/50 transition cursor-pointer"
                    onClick={() => navigate(`/mygroup/${group.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-white mb-1">{group.name}</p>
                        <p className="text-sm text-gray-400 line-clamp-2">{group.description}</p>
                      </div>
                      <FaArrowRight className="text-gray-600 ml-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaUsers className="text-4xl text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No groups joined yet.</p>
                <button
                  onClick={() => navigate("/groups")}
                  className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition"
                >
                  Join a Group
                </button>
              </div>
            )}
          </motion.div>

          {/* Expense History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-gray-800 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <FaMoneyBillWave />
              Expense History ({expenses.length})
            </h2>
            {expenses.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {expenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-[#0A0A0A] border border-gray-800 rounded-xl p-4 hover:border-yellow-400/50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-white mb-1">
                          {exp.description || exp.title || "Expense"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(exp.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-yellow-400 font-bold text-lg">
                        ₹{Number(exp.amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaMoneyBillWave className="text-4xl text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No expenses recorded yet.</p>
                <button
                  onClick={() => navigate("/groups")}
                  className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition"
                >
                  Add an Expense
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
