import React, { useEffect, useMemo, useState } from "react";
import { getExpensesAPI, deleteExpenseAPI } from "../services/allAPI";
import { FaSearch, FaFilter, FaDownload, FaSync, FaTrash, FaCalendarAlt, FaUsers, FaRupeeSign, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const formatDate = (iso) => {
  const date = new Date(iso);
  return date.toLocaleDateString("en-IN", { 
    day: "numeric", 
    month: "short", 
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const formatDateShort = (iso) => {
  const date = new Date(iso);
  return date.toLocaleDateString("en-IN", { 
    day: "numeric", 
    month: "short"
  });
};

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    q: "",
    groupId: "",
    paidBy: "",
    sortBy: "dateDesc",
    dateFrom: "",
    dateTo: "",
  });

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser"));
    } catch {
      return null;
    }
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [expRes, grpRes] = await Promise.all([
        getExpensesAPI(),
        fetch("http://localhost:3000/groups").then((r) => r.json()),
      ]);
      setExpenses(expRes.data || []);
      setGroups(grpRes || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      alert("Error loading expenses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    let list = [...expenses];
    const { q, groupId, paidBy, dateFrom, dateTo, sortBy } = filters;

    if (q) {
      const ql = q.toLowerCase();
      list = list.filter(
        (e) =>
          e.description?.toLowerCase().includes(ql) ||
          String(e.amount).includes(ql) ||
          e.paidBy?.toLowerCase().includes(ql)
      );
    }
    if (groupId) list = list.filter((e) => String(e.groupId) === String(groupId));
    if (paidBy) list = list.filter((e) => e.paidBy?.toLowerCase() === paidBy.toLowerCase());
    if (dateFrom) list = list.filter((e) => new Date(e.date) >= new Date(dateFrom));
    if (dateTo) list = list.filter((e) => new Date(e.date) <= new Date(dateTo));

    switch (sortBy) {
      case "amountAsc":
        list.sort((a, b) => (a.amount || 0) - (b.amount || 0));
        break;
      case "amountDesc":
        list.sort((a, b) => (b.amount || 0) - (a.amount || 0));
        break;
      case "dateAsc":
        list.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "dateDesc":
      default:
        list.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return list;
  }, [expenses, filters]);

  const totals = useMemo(() => {
    const total = filtered.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const byPayer = filtered.reduce((acc, e) => {
      const key = e.paidBy || "Unknown";
      acc[key] = (acc[key] || 0) + Number(e.amount || 0);
      return acc;
    }, {});
    return { total, byPayer };
  }, [filtered]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await deleteExpenseAPI(id);
      setExpenses((prev) => prev.filter((e) => String(e.id) !== String(id)));
    } catch (error) {
      alert("Error deleting expense. Please try again.");
    }
  };

  const exportCSV = () => {
    const headers = ["Date", "Description", "Group", "Paid By", "Amount"];
    const rows = filtered.map((e) => {
      const group = groups.find((g) => String(g.id) === String(e.groupId));
      return [
        formatDate(e.date),
        e.description || "",
        group?.name || e.groupId || "",
        e.paidBy || "",
        e.amount || 0,
      ];
    });
    const csv = [headers.join(","), ...rows.map(r => r.map(cell => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uniquePayers = useMemo(() => {
    return Array.from(new Set(expenses.map((e) => e.paidBy).filter(Boolean)));
  }, [expenses]);

  const clearFilters = () => {
    setFilters({
      q: "",
      groupId: "",
      paidBy: "",
      sortBy: "dateDesc",
      dateFrom: "",
      dateTo: "",
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== "dateDesc").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] text-white p-4 md:p-6 pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
                Expenses
              </h1>
              <p className="text-gray-400">Track and manage all your group expenses</p>
            </div>
            {currentUser && (
              <div className="flex items-center gap-2 text-sm text-gray-300 bg-[#1A1A1A] px-4 py-2 rounded-lg border border-gray-800">
                <FaUsers className="text-yellow-400" />
                <span>Logged in as: <span className="text-yellow-400 font-semibold">{currentUser.name || currentUser.username || "User"}</span></span>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Expenses</p>
                  <p className="text-2xl font-bold text-yellow-400">₹{totals.total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
                </div>
                <FaRupeeSign className="text-3xl text-yellow-400/50" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Records</p>
                  <p className="text-2xl font-bold text-blue-400">{filtered.length}</p>
                </div>
                <FaCalendarAlt className="text-3xl text-blue-400/50" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Active Filters</p>
                  <p className="text-2xl font-bold text-purple-400">{activeFiltersCount}</p>
                </div>
                <FaFilter className="text-3xl text-purple-400/50" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-[#1A1A1A]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 mb-6 shadow-xl">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="flex-1 w-full relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search expenses by description, amount, or payer..."
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#0A0A0A] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
                  showFilters || activeFiltersCount > 0
                    ? "bg-yellow-400 text-black hover:bg-yellow-300"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                <FaFilter />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>
              <button
                onClick={exportCSV}
                className="px-4 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition flex items-center gap-2"
              >
                <FaDownload />
                Export
              </button>
              <button
                onClick={fetchAll}
                className="px-4 py-3 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition flex items-center gap-2"
              >
                <FaSync />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-gray-800 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  <select
                    value={filters.groupId}
                    onChange={(e) => setFilters({ ...filters, groupId: e.target.value })}
                    className="p-3 rounded-lg bg-[#0A0A0A] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  >
                    <option value="">All Groups</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>

                  <select
                    value={filters.paidBy}
                    onChange={(e) => setFilters({ ...filters, paidBy: e.target.value })}
                    className="p-3 rounded-lg bg-[#0A0A0A] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  >
                    <option value="">All Payers</option>
                    {uniquePayers.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>

                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="p-3 rounded-lg bg-[#0A0A0A] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                    placeholder="From Date"
                  />

                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="p-3 rounded-lg bg-[#0A0A0A] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                    placeholder="To Date"
                  />

                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="p-3 rounded-lg bg-[#0A0A0A] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  >
                    <option value="dateDesc">Newest First</option>
                    <option value="dateAsc">Oldest First</option>
                    <option value="amountDesc">Amount: High to Low</option>
                    <option value="amountAsc">Amount: Low to High</option>
                  </select>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mt-3 text-yellow-400 hover:text-yellow-300 text-sm flex items-center gap-1"
                  >
                    <FaTimes /> Clear all filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Payer Breakdown */}
        {Object.keys(totals.byPayer).length > 0 && (
          <div className="bg-[#1A1A1A]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3 text-yellow-400">Spending by Payer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(totals.byPayer).map(([payer, amt]) => (
                <div key={payer} className="bg-[#0A0A0A] border border-gray-700 rounded-lg p-3 flex items-center justify-between hover:border-yellow-400/50 transition">
                  <span className="text-gray-300 font-medium">{payer}</span>
                  <span className="text-yellow-400 font-bold">₹{amt.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expenses List - Card View */}
        {filtered.length === 0 ? (
          <div className="bg-[#1A1A1A]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-12 text-center">
            <FaCalendarAlt className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No expenses found</p>
            <p className="text-gray-500 text-sm">
              {activeFiltersCount > 0 
                ? "Try adjusting your filters or add a new expense."
                : "Start by creating a group and adding expenses."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((expense, index) => {
                const group = groups.find((g) => String(g.id) === String(expense.groupId));
                return (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-gray-800 rounded-xl p-5 hover:border-yellow-400/50 hover:shadow-xl hover:shadow-yellow-400/10 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-400 transition">
                          {expense.description || "Untitled Expense"}
                        </h3>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <FaCalendarAlt className="text-yellow-400/70" />
                          {formatDateShort(expense.date)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="opacity-0 group-hover:opacity-100 transition p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300"
                        title="Delete expense"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Amount</span>
                        <span className="text-2xl font-bold text-yellow-400">
                          ₹{Number(expense.amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Paid By</span>
                        <span className="text-white font-semibold">{expense.paidBy || "Unknown"}</span>
                      </div>
                      {group && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Group</span>
                          <span className="text-blue-400 font-medium">{group.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-800">
                      <p className="text-xs text-gray-500">{formatDate(expense.date)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
