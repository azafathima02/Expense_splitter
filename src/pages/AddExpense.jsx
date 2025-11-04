import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AddExpenseModal({ groupId, onClose }) {
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitEqually, setSplitEqually] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      const res = await axios.get(`http://localhost:5001/groups/${groupId}`);
      setGroup(res.data);
      setMembers(res.data.members || []);
    };
    fetchGroup();
  }, [groupId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount || !paidBy) {
      alert("Please fill all fields");
      return;
    }

    const total = parseFloat(amount);
    await axios.post("http://localhost:5001/expenses", {
      groupId: Number(groupId),
      description,
      amount: total,
      paidBy,
      date: new Date().toISOString(),
    });

    alert("Expense added successfully!");
    onClose(); // close modal
  };

  if (!group) return <p className="text-white">Loading...</p>;

  return (
    <div className="bg-[#1C1C1C] text-white p-6 rounded-2xl w-96 shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
        Add Expense for {group.name}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Expense Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-black/40 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="number"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-black/40 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400"
        />

        <select
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          className="w-full bg-black/40 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">Who Paid?</option>
          {members.map((m, idx) => (
            <option key={idx} value={m}>
              {m}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={splitEqually}
            onChange={() => setSplitEqually(!splitEqually)}
          />
          Split Equally Among Members
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-bold py-2 rounded-lg hover:bg-yellow-300"
          >
            Add Expense
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-600 text-white font-bold py-2 rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
