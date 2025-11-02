import React from "react";

export default function SummaryStats({ expenses }) {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const largest = expenses.reduce(
    (max, e) => (Number(e.amount) > max ? Number(e.amount) : max),
    0
  );

  const budget = 5000; // Example static budget

  return (
    <div className="bg-[#1C1C1C] p-4 rounded-xl border border-yellow-500/20 text-center text-yellow-300 space-y-1">
      <p>Total Spent: ₹{total.toFixed(2)}</p>
      <p>Budget Left: ₹{(budget - total).toFixed(2)}</p>
      <p>Largest Expense: ₹{largest.toFixed(2)}</p>
    </div>
  );
}
