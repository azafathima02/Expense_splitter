// src/components/AddExpenseForm.jsx
import React, { useState } from "react";

export default function AddExpenseForm({ onAddExpense }) {
  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!payer || !amount || !description) return alert("Please fill all fields!");

    const expense = {
      id: Date.now(),
      payer,
      amount: parseFloat(amount),
      description,
      members: members.split(",").map((m) => m.trim()),
    };
    onAddExpense(expense);
    setPayer("");
    setAmount("");
    setDescription("");
    setMembers("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1C1C1C] p-6 rounded-2xl shadow-lg text-gray-100 border border-yellow-500/20 space-y-4"
    >
      <h2 className="text-xl font-bold text-yellow-400">Add Expense</h2>

      <input
        type="text"
        placeholder="Who paid?"
        value={payer}
        onChange={(e) => setPayer(e.target.value)}
        className="w-full p-2 rounded-lg bg-black/50 border border-yellow-400/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <input
        type="number"
        placeholder="Amount (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 rounded-lg bg-black/50 border border-yellow-400/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <input
        type="text"
        placeholder="Description (e.g. Lunch)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 rounded-lg bg-black/50 border border-yellow-400/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <input
        type="text"
        placeholder="Group Members (comma separated)"
        value={members}
        onChange={(e) => setMembers(e.target.value)}
        className="w-full p-2 rounded-lg bg-black/50 border border-yellow-400/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      <button
        type="submit"
        className="w-full py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg text-black font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-all"
      >
        Add Expense
      </button>
    </form>
  );
}
