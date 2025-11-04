import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyGroup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const API = "http://localhost:5001";

  useEffect(() => {
    const fetchData = async () => {
      const groupRes = await axios.get(`${API}/groups/${id}`);
      const messagesRes = await axios.get(`${API}/messages?groupId=${id}`);
      const expensesRes = await axios.get(`${API}/expenses?groupId=${id}`);

      setGroup(groupRes.data);
      setMessages(messagesRes.data);
      setExpenses(expensesRes.data);
    };
    fetchData();
  }, [id]);

  const handleSend = async () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      groupId: id,
      sender: "You",
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    await axios.post(`${API}/messages`, messageData);
    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
  };

  const handleExpenseClick = async (expense) => {
    try {
      const owesRes = await axios.get(`${API}/messages?groupId=${id}`);
      const owesMessages = owesRes.data.filter(
        (msg) =>
          msg.text.includes(expense.paidBy) &&
          msg.text.includes("owes") &&
          msg.text.includes("₹")
      );

      setSelectedExpense({ ...expense, owesMessages });
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching owes messages:", err);
    }
  };

  const closeModal = () => {
    setSelectedExpense(null);
    setShowModal(false);
  };

  const handleAddExpense = () => {
    navigate(`/addexpense/${id}`);
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex flex-col pt-[80px]">
      {/* Header Section */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-[#0A0A0A] sticky top-[60px] z-10">
        <div>
          <h1
            className="text-2xl font-bold text-yellow-400 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {group.name} ⌄
          </h1>

          {showDropdown && (
            <div className="absolute bg-[#1E1E1E] p-3 rounded-lg mt-2 shadow-lg border border-gray-700 w-64">
              <p className="text-sm text-gray-300 mb-2">
                <span className="font-semibold text-yellow-400">
                  Description:
                </span>{" "}
                {group.description || "No description available"}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-yellow-400">Members:</span>
              </p>
              <ul className="list-disc ml-5 text-sm text-gray-400">
                {group.members && group.members.length > 0 ? (
                  group.members.map((m, i) => <li key={i}>{m}</li>)
                ) : (
                  <li>No members listed</li>
                )}
              </ul>
            </div>
          )}

          <p className="text-sm text-gray-400">
            Remaining Budget: ₹{group.budget ?? 0}
          </p>
        </div>

        <button
          onClick={handleAddExpense}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
        >
          + Add Expense
        </button>
      </div>

      {/* Chat Section */}
      <div className="flex-1 overflow-y-auto px-4 py-3 mt-2">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className="mb-3">
              <div
                className={`${
                  msg.sender === "System"
                    ? "bg-[#1E1E1E] text-white self-start"
                    : msg.sender === "You"
                    ? "bg-yellow-500 text-black self-end ml-auto"
                    : "bg-gray-800 text-white"
                } px-3 py-2 rounded-lg max-w-md`}
              >
                <p className="font-semibold text-sm">{msg.sender}</p>
                <p>{msg.text}</p>
                <p className="text-xs mt-1 text-gray-400">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">
            No messages yet. Start chatting!
          </p>
        )}
      </div>

      {/* Toggle Expenses Button */}
      <div className="bg-[#0A0A0A] p-3 border-t border-gray-700 flex justify-center">
        <button
          onClick={() => setShowExpenses(!showExpenses)}
          className="text-yellow-400 font-semibold hover:text-yellow-300 transition"
        >
          💰 {showExpenses ? "Hide Expenses" : "View Expenses"}
        </button>
      </div>

      {/* Expenses Section (Togglable) */}
      {showExpenses && (
        <div className="bg-black p-4 border-t border-gray-700 animate-slideDown">
          <h3 className="text-yellow-400 font-bold mb-3">Expenses</h3>
          <div className="space-y-2">
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <div
                  key={expense.id}
                  onClick={() => handleExpenseClick(expense)}
                  className="cursor-pointer bg-[#1E1E1E] hover:bg-[#2A2A2A] rounded-xl p-3"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold text-yellow-400">
                      {expense.description || expense.title}
                    </span>
                    <span>₹{expense.amount}</span>
                  </div>
                  <p className="text-sm mt-1 text-gray-300">
                    Paid by{" "}
                    <span className="font-semibold">{expense.paidBy}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No expenses added yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="flex items-center p-4 bg-[#0A0A0A] border-t border-gray-700 sticky bottom-0">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-lg bg-[#1E1E1E] text-white outline-none"
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold"
        >
          ➤
        </button>
      </div>

      {/* Expense Details Modal */}
      {showModal && selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1E1E1E] p-6 rounded-xl w-[90%] max-w-md text-white">
            <h2 className="text-xl font-bold text-yellow-400 mb-2">
              {selectedExpense.description || selectedExpense.title}
            </h2>
            <p className="mb-2 text-gray-300">
              Amount: ₹{selectedExpense.amount}
            </p>
            <p className="mb-2 text-gray-300">
              Paid by:{" "}
              <span className="text-yellow-400">{selectedExpense.paidBy}</span>
            </p>

            <div className="mt-4 space-y-2">
              <h3 className="text-yellow-400 font-semibold mb-2">
                Split Details
              </h3>
              {selectedExpense.owesMessages &&
              selectedExpense.owesMessages.length > 0 ? (
                selectedExpense.owesMessages.map((m, index) => (
                  <div
                    key={index}
                    className="bg-[#2A2A2A] rounded-lg p-2 text-sm text-gray-300"
                  >
                    💬 {m.text}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">
                  No split details available.
                </p>
              )}
            </div>

            <button
              onClick={closeModal}
              className="mt-4 w-full bg-yellow-500 text-black py-2 rounded-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
