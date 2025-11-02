// src/pages/Expenses.jsx
import React, { useState } from "react";
import AddExpenseForm from "../components/AddExpenseForm";
import ExpenseList from "../components/ExpenseList";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);

  const handleAddExpense = (expense) => {
    setExpenses([...expenses, expense]);
    setTotalSpent(totalSpent + expense.amount);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-yellow-400 mb-8">Expense Tracker</h1>

      <div className="w-full max-w-2xl space-y-6">
        <AddExpenseForm onAddExpense={handleAddExpense} />
        <div className="bg-[#1C1C1C] p-4 rounded-xl border border-yellow-500/20 text-yellow-300 text-center font-semibold">
          Total Spent: ₹{totalSpent.toFixed(2)}
        </div>
        <ExpenseList expenses={expenses} />
      </div>
    </div>
  );
}
