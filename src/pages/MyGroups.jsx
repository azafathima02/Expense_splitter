import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ExpenseMessageCard from "../components/ExpenseMessageCard"; // 👈 your updated card

const MyGroup = () => {
  const { id } = useParams(); // group id from URL
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null); // 👈 for modal handling

  const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const handleAddExpense = () => {
    navigate(`/mygroup/${id}/addexpense`);
  };

  // Fetch group details, users, and messages
  useEffect(() => {
    const fetchData = async () => {
      const [groupRes, msgRes, userRes] = await Promise.all([
        fetch(`http://localhost:5001/groups/${id}`),
        fetch(`http://localhost:5001/messages?groupId=${id}`),
        fetch(`http://localhost:5001/users`),
      ]);

      const groupData = await groupRes.json();
      const msgData = await msgRes.json();
      const userData = await userRes.json();

      setGroup(groupData);
      setMessages(msgData);
      setUsers(userData);
    };

    fetchData();
  }, [id]);

  // Send new message
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const msg = {
      groupId: Number(id),
      sender: loggedUser.name,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    await fetch(`http://localhost:5001/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg),
    });

    setMessages([...messages, msg]);
    setNewMessage("");
  };

  if (!group || !loggedUser) return <p>Loading...</p>;

  // Filter members of the group
  const groupMembers = users.filter((u) => group.members.includes(Number(u.id)));

  // Separate normal messages and expense messages
  const normalMessages = messages.filter((msg) => !msg.isExpense);
  const expenseMessages = messages.filter((msg) => msg.isExpense);

  // Handle expense modal open
  const handleOpenModal = (expense) => {
    setSelectedExpense(expense);
  };

  // Handle expense modal close
  const handleCloseModal = () => {
    setSelectedExpense(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
        <h2 className="text-xl font-semibold">Expense Splitter</h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-[#FFC300] text-black px-4 py-1 rounded-lg font-semibold"
        >
          Back
        </button>
      </header>

      {/* Navbar below header */}
      <nav className="flex justify-between items-center mb-4">
        <div>
          <button
            className="text-lg font-semibold hover:underline"
            onClick={() => setShowDetails(!showDetails)}
          >
            {group.name} ⬇
          </button>
          {showDetails && (
            <div className="bg-gray-900 border border-gray-700 mt-2 p-3 rounded-xl w-64">
              <p className="text-sm text-gray-300 mb-2">{group.description}</p>
              <h4 className="font-semibold mb-1">Members:</h4>
              <ul className="list-disc ml-5">
                {groupMembers.map((m) => (
                  <li key={m.id}>{m.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Chat Box */}
      <div className="bg-gray-900 p-4 rounded-xl h-[50vh] overflow-y-auto mb-4 shadow-lg">
        {normalMessages.length === 0 ? (
          <p className="text-gray-400">No messages yet...</p>
        ) : (
          normalMessages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-3 p-2 rounded-lg max-w-xs ${
                msg.sender === loggedUser.name
                  ? "ml-auto bg-[#FFC300] text-black"
                  : "bg-gray-800 text-white"
              }`}
            >
              <p className="text-sm font-semibold">{msg.sender}</p>
              <p>{msg.text}</p>
              <p className="text-xs text-gray-400">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* 💰 Expense Messages Section */}
      {expenseMessages.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-[#FFC300]">Expenses</h3>
          <div className="flex flex-col gap-2">
            {expenseMessages.map((expense) => (
              <ExpenseMessageCard
                key={expense.id}
                expense={expense}
                onOpenModal={handleOpenModal}
              />
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 bg-gray-800 text-white rounded-lg outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-[#FFC300] text-black px-3 py-2 rounded-lg font-semibold"
        >
          ➤
        </button>
        <button
          onClick={handleAddExpense}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg shadow hover:bg-yellow-300 transition-all"
        >
          ➕ Add Expense
        </button>
      </div>

      {/* Expense Details Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-xl w-80">
            <h3 className="text-lg font-semibold mb-3 text-[#FFC300]">
              Expense Details
            </h3>
            <p className="text-sm mb-1">💬 {selectedExpense.description}</p>
            <p className="text-sm mb-1">💰 Amount: ₹{selectedExpense.amount}</p>
            <p className="text-sm mb-1">
              👤 Paid by: {selectedExpense.paidBy}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(selectedExpense.date).toLocaleString()}
            </p>
            <button
              onClick={handleCloseModal}
              className="mt-4 w-full bg-[#FFC300] text-black py-2 rounded-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGroup;
