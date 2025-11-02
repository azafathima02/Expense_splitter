import React, { useEffect, useState } from "react";
import AddExpenseForm from "../components/AddExpenseForm";
import ExpenseList from "../components/ExpenseList";
import SummaryStats from "../components/SummmaryStats";
import BalanceTable from "../components/BalanceTable";
import {
  addExpenseAPI,
  getExpensesAPI,
  deleteExpenseAPI,
  updateExpenseAPI,
} from "../services/allAPI";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  const [sortOrder, setSortOrder] = useState("latest");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await getExpensesAPI();
      if (res?.data) setExpenses(res.data);
    } catch (err) {
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expense, editId = null) => {
    try {
      if (editId) {
        const res = await updateExpenseAPI(editId, expense);
        setExpenses((prev) =>
          prev.map((e) => (e.id === editId ? res.data : e))
        );
        setEditingExpense(null);
      } else {
        const res = await addExpenseAPI(expense);
        setExpenses((prev) => [...prev, res.data]);
      }
    } catch (err) {
      alert("Error saving expense");
    }
  };

  const handleDeleteExpense = async (id) => {
    await deleteExpenseAPI(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold text-[#FFC300] mb-8">
        Expense Tracker 💰
      </h1>

      <div className="w-full max-w-3xl space-y-6">
        <AddExpenseForm
          onAddExpense={handleAddExpense}
          editingExpense={editingExpense}
        />

        {loading && (
          <p className="text-gray-400 text-center">Loading expenses...</p>
        )}
        {error && <p className="text-red-400 text-center">{error}</p>}

        <SummaryStats expenses={expenses} />
        <ExpenseList
          expenses={expenses}
          onDelete={handleDeleteExpense}
          onEdit={(exp) => setEditingExpense(exp)}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          categoryFilter={categoryFilter}
          onFilterChange={setCategoryFilter}
        />
        <BalanceTable expenses={expenses} />
      </div>
    </div>
  );
}
