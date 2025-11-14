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
  const [user, setUser] = useState(null);

  // ✅ Load logged-in user + fetch group
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedUser) {
      alert("Please log in first!");
      navigate("/login");
      return;
    }
    setUser(loggedUser);

    const fetchGroup = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/groups/${id}`);
        const groupData = res.data;

        // ✅ Check if user is part of the group
        const membersList = groupData.members || [];
        const isMember =
          membersList.includes(loggedUser.name) ||
          membersList.includes(String(loggedUser.id)) ||
          String(groupData.createdBy) === String(loggedUser.id);

        if (!isMember) {
          alert("You are not a member of this group!");
          navigate("/dashboard");
          return;
        }

        setGroup(groupData);
        setMembers(membersList);
      } catch (error) {
        console.error("Error fetching group:", error);
        alert("Unable to load group data.");
        navigate("/dashboard");
      }
    };

    fetchGroup();
  }, [id, navigate]);

  // ✅ Handle Expense Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount || !paidBy) {
      alert("Please fill all fields");
      return;
    }

    const total = parseFloat(amount);
    if (isNaN(total) || total <= 0) {
      alert("Enter a valid amount");
      return;
    }

    const perPerson = splitEqually
      ? (total / members.length).toFixed(2)
      : total.toFixed(2);

    try {
      // 1️⃣ Add expense as a message (for chat view)
      await axios.post("http://localhost:3000/messages", {
        id: Date.now().toString(),
        groupId: String(id),
        sender: paidBy,
        text: `Added expense: ${description} (₹${total})`,
        isExpense: true,
        timestamp: new Date().toISOString(),
      });

      // 2️⃣ Add expense to /expenses
      await axios.post("http://localhost:3000/expenses", {
        id: Date.now().toString(),
        groupId: String(id),
        description,
        amount: total,
        paidBy,
        date: new Date().toISOString(),
        members,
        category: description,
      });

      // 3️⃣ Update group budget safely
      if (group.budget !== undefined && group.budget !== null) {
        const updatedBudget = Math.max((group.budget || 0) - total, 0);
        await axios.patch(`http://localhost:3000/groups/${id}`, {
          budget: updatedBudget,
        });
      }

      // 4️⃣ Add "owes" system messages for members
      const owesMessages = members
        .filter((m) => m !== paidBy)
        .map((m) => ({
          id: Date.now().toString() + Math.random(),
          groupId: String(id),
          sender: "System",
          text: `${m} owes ${paidBy} ₹${perPerson}`,
          timestamp: new Date().toISOString(),
        }));

      for (let msg of owesMessages) {
        await axios.post("http://localhost:3000/messages", msg);
      }

      alert("Expense added successfully!");
      navigate(`/mygroup/${id}`);
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    }
  };

  if (!group)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading group details...
      </div>
    );

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

          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={splitEqually}
              onChange={() => setSplitEqually(!splitEqually)}
            />
            Split Equally Among Members
          </label>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-3 rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all"
          >
            Add Expense
          </button>
        </form>

        {group.budget !== undefined && (
          <p className="text-center text-gray-400 mt-4 text-sm">
            Remaining Budget: ₹{group.budget?.toLocaleString("en-IN") || 0}
          </p>
        )}
      </div>
    </div>
  );
}
