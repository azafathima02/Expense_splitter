import React from "react";

export default function ExpenseMessageCard({ expense, onOpenModal }) {
  if (!expense) return null;

  return (
    <div
      onClick={() => onOpenModal(expense)}
      className="cursor-pointer bg-gradient-to-r from-yellow-500/20 to-yellow-400/10 border border-yellow-400/30 
                 text-yellow-300 p-3 rounded-xl shadow-md hover:shadow-yellow-400/20 
                 transition-all max-w-xs self-end ml-auto"
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold">{expense.description}</span>
        <span className="text-sm">₹{expense.amount}</span>
      </div>
      <p className="text-sm text-gray-300 mt-1">
        Paid by <span className="text-yellow-400">{expense.paidBy}</span>
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {new Date(expense.date).toLocaleDateString()}
      </p>
    </div>
  );
}
