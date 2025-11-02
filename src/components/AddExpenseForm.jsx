import React, { useState, useEffect } from "react";

const categories = [
  { label: "Food", icon: "🍔" },
  { label: "Travel", icon: "🚗" },
  { label: "Shopping", icon: "🛍️" },
  { label: "Accommodation", icon: "🏨" },
  { label: "Miscellaneous", icon: "💡" },
];

export default function AddExpenseForm({ onAddExpense, editingExpense }) {
  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (editingExpense) {
      setPayer(editingExpense.payer);
      setAmount(editingExpense.amount);
      setDescription(editingExpense.description);
      setMembers(editingExpense.members.join(", "));
      setCategory(editingExpense.category);
      setNote(editingExpense.note || "");
      setDate(editingExpense.date || "");
    }
  }, [editingExpense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!payer || !amount || !description || !members) {
      alert("⚠️ Please fill all required fields!");
      return;
    }

    const expense = {
      payer,
      amount: parseFloat(amount),
      description,
      members: members.split(",").map((m) => m.trim()),
      category,
      note,
      date: date || new Date().toISOString().slice(0, 10),
    };

    onAddExpense(expense, editingExpense?.id);
    clearForm();
  };

  const clearForm = () => {
    setPayer("");
    setAmount("");
    setDescription("");
    setMembers("");
    setCategory("Food");
    setNote("");
    setDate("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1C1C1C] p-6 rounded-2xl shadow-lg text-gray-100 border border-yellow-500/20 space-y-4"
    >
      <h2 className="text-xl font-bold text-yellow-400">
        {editingExpense ? "Edit Expense" : "Add Expense"}
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Who paid?"
          value={payer}
          onChange={(e) => setPayer(e.target.value)}
          className="p-2 rounded-lg bg-black/50 border border-yellow-400/30 focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="number"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 rounded-lg bg-black/50 border border-yellow-400/30 focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <input
        type="text"
        placeholder="Expense Title"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 rounded-lg bg-black/50 border border-yellow-400/30 focus:ring-2 focus:ring-yellow-400"
      />

      <input
        type="text"
        placeholder="Group Members (comma separated)"
        value={members}
        onChange={(e) => setMembers(e.target.value)}
        className="w-full p-2 rounded-lg bg-black/50 border border-yellow-400/30 focus:ring-2 focus:ring-yellow-400"
      />

      <div className="grid grid-cols-2 gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 rounded-lg bg-black/50 border border-yellow-400/30 focus:ring-2 focus:ring-yellow-400"
        >
          {categories.map((c) => (
            <option key={c.label} value={c.label}>
              {c.icon} {c.label}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 rounded-lg bg-black/50 border border-yellow-400/30 focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <textarea
        placeholder="Add a note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-2 rounded-lg bg-black/50 border border-yellow-400/30 focus:ring-2 focus:ring-yellow-400"
      />

      <button
        type="submit"
        className="w-full py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg text-black font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-all"
      >
        {editingExpense ? "Update Expense" : "Add Expense"}
      </button>
    </form>
  );
}
