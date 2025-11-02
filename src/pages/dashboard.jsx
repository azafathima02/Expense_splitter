import React, { useMemo } from "react";
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
  FaChartPie,
  FaCreditCard,
  FaChartLine,
} from "react-icons/fa";

// MOCK DATA

const CURRENT_USER = "john";

const GROUP_MOCK_EXPENSES = [
  {
    groupId: "G1",
    groupName: "Trip to Goa",
    payer: "john",
    amount: 600,
    description: "Toll fee",
    members: ["john", "max", "kunal"],
    category: "Travel",
  },
  {
    groupId: "G1",
    groupName: "Trip to Goa",
    payer: "max",
    amount: 1000,
    description: "Dinner",
    members: ["john", "max"],
    category: "Food",
  },

  {
    groupId: "G2",
    groupName: "Apartment",
    payer: "john",
    amount: 3000,
    description: "Rent",
    members: ["john", "kunal"],
    category: "Housing",
  },

  {
    groupId: "G3",
    groupName: "Farewell Party",
    payer: "kunal",
    amount: 2500,
    description: "Cake",
    members: ["john", "kunal", "max", "shweta"],
    category: "Food",
  },
];

const MOCK_BUDGETS = {
  groupBudget: 7000,
};

//  DATA TRANSFORMATION LOGIC (Group-Only Focus)

const calculateUserSummary = (expenses, currentUser, budgets) => {
  let netBalance = 0;
  let totalGroupSpent = 0;
  let groupSpendingMap = {};
  let categoryMap = {};
  const groups = new Set();

  expenses.forEach((expense) => {
    const isGroupExpense = expense.members.length > 1;
    const isMember = expense.members.includes(currentUser);

    if (!isGroupExpense || !isMember) return;

    const amount = expense.amount || 0;
    const share = amount / expense.members.length;
    const category = expense.category || "Other";

    //  Accumulate Totals
    groups.add(expense.groupName);
    totalGroupSpent += share;

    //  Net Balance Calculation
    if (expense.payer === currentUser) {
      netBalance += amount - share;
    } else {
      netBalance -= share;
    }

    // Group Breakdown Map for Bar Chart
    const groupName = expense.groupName;
    groupSpendingMap[groupName] = (groupSpendingMap[groupName] || 0) + share;

    // Category Breakdown Map for Pie Chart
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

//  DASHBOARD COMPONENT

const Dashboard = () => {
  const summary = useMemo(
    () => calculateUserSummary(GROUP_MOCK_EXPENSES, CURRENT_USER, MOCK_BUDGETS),
    []
  );

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
      title: "Total Group Share",
      value: `₹${summary.totalGroupSpent}`,
      icon: <FaUsers />,
      color: "from-purple-500 to-indigo-500",
      description: `Group Budget: ₹${summary.groupRemaining} remaining`,
    },
  ];

  // Colors for the Pie Chart categories
  const PIE_COLORS = ["#facc15", "#34d399", "#6366f1", "#fb7185", "#38bdf8"];

  // Placeholder for router navigation
  const handleGroupClick = (data) => {
    console.log(`Navigating to group detail page for: ${data.name}`);
    alert(`Navigating to the transaction list for the group: ${data.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-10 text-white">
      <h1 className="text-3xl font-extrabold text-yellow-400 mb-2">
        Group Tracker Dashboard
      </h1>
      <p className="text-lg text-gray-400 mb-8">
        Your financial summary based purely on shared group expenses.
      </p>

      {/* --- Summary Cards --- */}
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
            className={`p-6 rounded-xl shadow-xl text-white bg-gradient-to-br ${card.color} flex flex-col justify-between h-full cursor-pointer transition-all duration-300 transform`}
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

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
        {/* PIE CHART: Category Breakdown  */}
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
                formatter={(value) => [
                  `₹${value.toLocaleString("en-IN")}`,
                  "Share",
                ]}
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

        {/* BAR CHART: Group Spending Breakdown */}
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
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#4B5563"
                vertical={false}
              />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                formatter={(value) => [
                  `₹${value.toLocaleString("en-IN")}`,
                  "Your Share",
                ]}
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
                onClick={handleGroupClick}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
