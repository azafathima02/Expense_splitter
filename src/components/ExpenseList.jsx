import React from "react";

export default function ExpenseList({ expenses, onDelete, onEdit, sortOrder, onSortChange, categoryFilter, onFilterChange }) {
  const sortedExpenses = [...expenses].sort((a, b) =>
    sortOrder === "latest"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
  );

  const filteredExpenses =
    categoryFilter === "All"
      ? sortedExpenses
      : sortedExpenses.filter((e) => e.category === categoryFilter);

  if (filteredExpenses.length === 0)
    return <p className="text-gray-400 text-center mt-6">No expenses found.</p>;

  return (
    <div className="space-y-4 mt-6">
      <div className="flex justify-between items-center mb-4">
        <select
          value={categoryFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="bg-black/50 border border-yellow-500/20 rounded-lg p-2 text-yellow-300"
        >
          <option value="All">All Categories</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Accommodation">Accommodation</option>
          <option value="Miscellaneous">Miscellaneous</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-black/50 border border-yellow-500/20 rounded-lg p-2 text-yellow-300"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {filteredExpenses.map((exp) => {
        const share = exp.members?.length
          ? exp.amount / exp.members.length
          : exp.amount;
        return (
          <div
            key={exp.id}
            className="bg-[#1C1C1C] p-4 rounded-xl border border-yellow-500/20 shadow-md hover:shadow-yellow-400/10 transition-all"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-yellow-400 font-semibold flex items-center gap-2">
                  <span>
                    {
                      { Food: "🍔", Travel: "🚗", Shopping: "🛍️", Accommodation: "🏨", Miscellaneous: "💡" }[
                        exp.category
                      ]
                    }
                  </span>
                  {exp.description}
                </h3>
                <p className="text-gray-300 text-sm">
                  Paid by <span className="text-yellow-300">{exp.payer}</span> — ₹
                  {exp.amount}
                </p>
                {exp.note && (
                  <p className="text-gray-400 text-sm italic">"{exp.note}"</p>
                )}
                <p className="text-gray-400 text-sm">
                  {exp.date} | Split among: {exp.members?.join(", ")}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Each owes: ₹{share.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(exp)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(exp.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  ❌
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
