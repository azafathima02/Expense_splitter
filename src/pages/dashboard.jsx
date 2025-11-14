import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  FaUsers,
  FaWallet,
  FaLayerGroup,
  FaChartLine,
  FaCreditCard,
} from "react-icons/fa";
import { getExpensesAPI, getGroupsAPI } from "../services/allAPI"; // ✅ Backend APIs

// 🧮 Helper: Calculate Summary
const calculateUserSummary = (expenses, currentUser, budgets) => {
  let netBalance = 0;
  let totalGroupSpent = 0;
  let groupSpendingMap = {};
  let categoryMap = {};
  const groups = new Set();

  expenses.forEach((expense) => {
    const members = Array.isArray(expense.members) ? expense.members : [];
    const isMember = members
      .map((m) => m.toLowerCase())
      .includes(currentUser.toLowerCase());

    if (!isMember) return;

    const amount = expense.amount || 0;
    const share = amount / (members.length || 1);
    const category = expense.category || expense.description || "Other";

    // Totals
    groups.add(expense.groupName);
    totalGroupSpent += share;

    // Net Balance logic — FIXED (paidBy instead of payer)
    if (expense.paidBy?.toLowerCase() === currentUser.toLowerCase()) {
      netBalance += amount - share;
    } else {
      netBalance -= share;
    }

    // Group breakdown
    const groupName = expense.groupName || "Unknown Group";
    groupSpendingMap[groupName] =
      (groupSpendingMap[groupName] || 0) + share;

    // Category breakdown
    categoryMap[category] = (categoryMap[category] || 0) + share;
  });

  const groupBreakdownData = Object.keys(groupSpendingMap)
    .map((name) => ({
      name: name,
      "Your Share": Math.round(groupSpendingMap[name]),
    }))
    .sort((a, b) => b["Your Share"] - a["Your Share"]);

  const categoryData = Object.keys(categoryMap).map((category) => ({
    name: category,
    value: Math.round(categoryMap[category]),
  }));

  return {
    netBalance: Math.round(netBalance),
    totalGroupSpent: Math.round(totalGroupSpent),
    totalGroups: groups.size,
    groupRemaining: budgets.groupBudget - Math.round(totalGroupSpent),
    groupBreakdownData,
    categoryData,
  };
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get current user from localStorage
  const currentUser = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      return user?.name || user?.username || null;
    } catch {
      return null;
    }
  })();

  const CURRENT_USER = currentUser || "Guest";

  useEffect(() => {
    // Redirect to login if no user is logged in
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, groupsRes] = await Promise.all([
          getExpensesAPI(),
          getGroupsAPI(),
        ]);

        const expensesData = expensesRes.data || [];
        const groupsData = groupsRes.data || [];
        setGroups(groupsData);

        // Create lookup maps
        const groupsMap = {};
        const groupsMembersMap = {};

        groupsData.forEach((group) => {
          groupsMap[String(group.id)] = group.name;
          groupsMembersMap[String(group.id)] = group.members || [];
        });

        // Attach groupName and members to expenses
        const updatedExpenses = expensesData.map((expense) => ({
          ...expense,
          groupName: groupsMap[String(expense.groupId)] || `Group ${expense.groupId}`,
          members: groupsMembersMap[String(expense.groupId)] || [],
        }));

        console.log("✅ Updated Expenses:", updatedExpenses);
        setExpenses(updatedExpenses);
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate total group budget from groups user is a member of
  const totalGroupBudget = useMemo(() => {
    if (!currentUser || groups.length === 0) return 0;
    
    const userName = (currentUser || "").toLowerCase();
    const loggedInUser = (() => {
      try {
        return JSON.parse(localStorage.getItem("loggedInUser"));
      } catch {
        return null;
      }
    })();
    const userId = loggedInUser ? String(loggedInUser.id) : "";
    
    return groups.reduce((total, group) => {
      const members = group.members || [];
      const isMember = members.some((m) => {
        const memberStr = String(m).toLowerCase();
        return memberStr === userName || 
               memberStr === userId.toLowerCase() ||
               String(group.createdBy).toLowerCase() === userId.toLowerCase();
      });
      
      if (isMember) {
        return total + (group.budget || 0);
      }
      return total;
    }, 0);
  }, [groups, currentUser]);

  const summary = useMemo(() => {
    if (expenses.length === 0)
      return {
        netBalance: 0,
        totalGroupSpent: 0,
        totalGroups: 0,
        groupRemaining: 0,
        groupBreakdownData: [],
        categoryData: [],
        totalGroupBudget: totalGroupBudget,
      };
    const calculated = calculateUserSummary(expenses, CURRENT_USER, { groupBudget: totalGroupBudget });
    return {
      ...calculated,
      totalGroupBudget: totalGroupBudget,
    };
  }, [expenses, totalGroupBudget]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-yellow-400 text-xl">
        Loading Dashboard Data...
      </div>
    );
  }

  // Summary Cards
  const cards = [
    {
      title: "Net Balance",
      value: `₹${summary.netBalance}`,
      icon: <FaWallet />,
      color:
        summary.netBalance >= 0
          ? "from-green-500 to-emerald-500"
          : "from-red-500 to-pink-500",
      description:
        summary.netBalance >= 0
          ? "Amount you are owed (Credit)"
          : "Amount you owe (Debit)",
    },
    {
      title: "Total Groups",
      value: summary.totalGroups,
      icon: <FaLayerGroup />,
      color: "from-blue-500 to-cyan-500",
      description: "Number of active groups you are in",
    },
    {
      title: "Group Budget",
      value: `₹${summary.totalGroupBudget || 0}`,
      icon: <FaUsers />,
      color: "from-purple-500 to-indigo-500",
      description: `Total budget across all your groups`,
    },
  ];

  const PIE_COLORS = ["#facc15", "#34d399", "#6366f1", "#fb7185", "#38bdf8"];

  const handleGroupClick = (data) => {
    alert(`Navigating to transactions for group: ${data.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-10 text-white">
      <h1 className="text-3xl font-extrabold text-yellow-400 mb-2 pb-1 py-9">
        Group Tracker Dashboard
      </h1>
      <p className="text-lg text-gray-400 mb-8">
        Your financial summary based on shared group expenses.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 15px -3px rgba(251, 191, 36, 0.3)",
            }}
            className={`p-6 rounded-xl shadow-xl bg-gradient-to-br ${card.color} flex flex-col justify-between h-full cursor-pointer transition-all duration-300 transform`}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium opacity-80">{card.title}</h3>
              <div className="text-xl">{card.icon}</div>
            </div>
            <p className="text-3xl font-extrabold mb-1">{card.value}</p>
            <p className="text-xs font-light opacity-80">{card.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
        {/* Pie Chart */}
        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-xl shadow-2xl border border-yellow-500/20">
          <h2 className="text-xl font-semibold mb-6 text-yellow-300">
            <FaChartLine className="inline mr-2" /> Spending by Category
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={summary.categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
              >
                {summary.categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                    stroke={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Share"]}
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #4B5563",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend
                wrapperStyle={{ color: "#9CA3AF", paddingTop: "10px" }}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-2xl border border-yellow-500/20">
          <h2 className="text-xl font-semibold mb-4 text-yellow-300">
            <FaCreditCard className="inline mr-2" /> Group Spending Breakdown
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Your calculated share of spending per group. (Click bar for details)
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={summary.groupBreakdownData}
              margin={{ top: 10, right: 10, bottom: 0, left: -20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" vertical={false} />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Your Share"]}
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #4B5563",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar
                dataKey="Your Share"
                fill="#facc15"
                radius={[8, 8, 0, 0]}
                cursor="pointer"
                onClick={(data) => handleGroupClick(data)}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
