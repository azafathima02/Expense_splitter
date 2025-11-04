import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitEqually, setSplitEqually] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      const res = await axios.get(`http://localhost:5001/groups/${id}`);
      setGroup(res.data);
      setMembers(res.data.members || []);
    };
    fetchGroup();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount || !paidBy) {
      alert("Please fill all fields");
      return;
    }

    const total = parseFloat(amount);
    const perPerson = splitEqually
      ? (total / members.length).toFixed(2)
      : total;

    // 1️⃣ Add new expense
    await axios.post("http://localhost:5001/expenses", {
      groupId: Number(id),
      description,
      amount: total,
      paidBy,
      date: new Date().toISOString(),
    });

    // 2️⃣ Update group remaining budget
    const updatedBudget = group.budget - total;
    await axios.patch(`http://localhost:5001/groups/${id}`, {
      budget: updatedBudget,
    });

    // 3️⃣ Add chat message for each owed member
    const owesMessages = members
      .filter((m) => m !== paidBy)
      .map((m) => ({
        groupId: Number(id),
        sender: "System",
        text: `${m} owes ${paidBy} ₹${perPerson}`,
        timestamp: new Date().toISOString(),
      }));

    for (let msg of owesMessages) {
      await axios.post("http://localhost:5001/messages", msg);
    }

    alert("Expense added successfully!");
    navigate(`/mygroup/${id}`);
  };

  if (!group) return <p className="text-center mt-20 text-white">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center pt-20">
      <div className="bg-[#1C1C1C] p-8 rounded-2xl w-full max-w-lg border border-gray-700 shadow-lg">
        <h2 className="text-3xl font-bold text-yellow-400 text-center mb-6">
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

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-300 transition-all"
          >
            Add Expense
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4">
          Remaining Group Budget: ₹{group.budget}
        </p>
      </div>
    </div>
  );
}
