// src/components/ExpenseList.jsx
import React from "react";

export default function ExpenseList({ expenses }) {
  if (expenses.length === 0) {
    return <p className="text-gray-400 text-center mt-6">No expenses added yet.</p>;
  }

  return (
    <div className="mt-6 space-y-4">
      {expenses.map((exp) => {
        const share = exp.amount / exp.members.length;
        return (
          <div
            key={exp.id}
            className="bg-[#1C1C1C] p-4 rounded-xl border border-yellow-500/20 shadow-md"
          >
            <h3 className="text-yellow-400 font-semibold">{exp.description}</h3>
            <p className="text-gray-300 text-sm">
              Paid by <span className="text-yellow-300">{exp.payer}</span> — ₹{exp.amount}
            </p>
            <p className="text-gray-400 text-sm">
              Split among: {exp.members.join(", ")}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Each owes: ₹{share.toFixed(2)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
