import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ExpenseMessageCard from "../components/ExpenseMessageCard";
import {
  FaArrowLeft,
  FaUsers,
  FaPlus,
  FaPaperPlane,
  FaChevronDown,
  FaChevronUp,
  FaMoneyBillWave,
  FaEdit,
  FaTimes,
  FaCheck
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { updateExpenseAPI } from "../services/allAPI";

const MyGroup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editForm, setEditForm] = useState({
    description: "",
    amount: "",
    paidBy: "",
  });
  const [selectedExpense, setSelectedExpense] = useState(null);

  // 💰 Payment Modal State
  const [showPayment, setShowPayment] = useState(false);
  const [paymentTo, setPaymentTo] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const loggedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser"));
    } catch {
      return null;
    }
  })();

  // 🟡 Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [groupRes, msgRes, userRes, expRes] = await Promise.all([
        fetch(`http://localhost:3000/groups/${id}`),
        fetch(`http://localhost:3000/messages`),
        fetch(`http://localhost:3000/users`),
        fetch(`http://localhost:3000/expenses`),
      ]);

      const groupData = await groupRes.json();
      const msgData = await msgRes.json();
      const userData = await userRes.json();
      const expData = await expRes.json();

      // ✅ Security: Only members can access
      const members = groupData.members || [];
      const isMember =
        members.includes(loggedUser?.name) ||
        members.includes(String(loggedUser?.id)) ||
        String(groupData.createdBy) === String(loggedUser?.id);

      if (!isMember) {
        alert("You are not a member of this group!");
        navigate("/dashboard");
        return;
      }

      setGroup(groupData);
      setMessages(msgData.filter((m) => String(m.groupId) === String(id)));
      setUsers(userData);
      setExpenses(expData.filter((e) => String(e.groupId) === String(id)));
    } catch (error) {
      console.error("Error fetching group:", error);
      alert("Error loading group data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Auto-scroll to bottom for new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🟢 Send Message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now().toString(),
      groupId: String(id),
      sender: loggedUser.name,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    await fetch(`http://localhost:3000/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg),
    });

    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  // 🟢 Add Expense Navigation
  const handleAddExpense = () => navigate(`/mygroup/${id}/addexpense`);

  // 🟢 Edit Expense
  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setEditForm({
      description: expense.description,
      amount: expense.amount,
      paidBy: expense.paidBy,
    });
  };

  const handleSaveEdit = async () => {
    if (!editForm.description || !editForm.amount || !editForm.paidBy)
      return alert("Please fill all fields");

    await updateExpenseAPI(editingExpense.id, {
      ...editingExpense,
      description: editForm.description,
      amount: parseFloat(editForm.amount),
      paidBy: editForm.paidBy,
    });

    alert("Expense updated successfully!");
    setEditingExpense(null);
    fetchData();
  };

  // 💰 Payment Modal Handler (Updated for Instant Update)
  const handleOpenPayment = async (to, amount) => {
    setPaymentTo(to);
    setPaymentAmount(amount);
    setShowPayment(true);

    const newMsg = {
      id: Date.now().toString(),
      groupId: String(id),
      sender: loggedUser.name,
      text: `Paid ₹${amount} to ${to} ✅`,
      timestamp: new Date().toISOString(),
    };

    try {
      // 1️⃣ Add to backend
      await fetch("http://localhost:3000/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });

      // 2️⃣ Instantly show in UI
      setMessages((prev) => [...prev, newMsg]);

      // 3️⃣ Smooth scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);

      // 4️⃣ Animate success check
      setPaymentSuccess(true);

      // 5️⃣ Auto-close modal
      setTimeout(() => {
        setPaymentSuccess(false);
        setShowPayment(false);
      }, 1800);
    } catch (err) {
      console.error("Error posting payment:", err);
      alert("Failed to record payment.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-yellow-400 text-xl">
        Loading group data...
      </div>
    );

  const groupMembers = users.filter(
    (u) => group.members.includes(u.name) || group.members.includes(String(u.id))
  );
  const normalMessages = messages.filter((msg) => !msg.isExpense);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] text-white">
      {/* Header */}
      <div className="bg-[#1A1A1A]/80 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-gray-800 rounded-lg transition"
            >
              <FaArrowLeft className="text-yellow-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-yellow-400">
                {group.name}
              </h1>
              <p className="text-sm text-gray-400">{group.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddExpense}
              className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg hover:from-yellow-300 hover:to-yellow-400 flex items-center gap-2"
            >
              <FaPlus /> Add Expense
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 hover:bg-gray-800 rounded-lg transition"
            >
              {showDetails ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
        </div>

        {/* Dropdown: Group details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="max-w-7xl mx-auto px-4 pb-4 overflow-hidden"
            >
              <div className="bg-[#0A0A0A] border border-gray-800 rounded-xl p-4 mt-2">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-yellow-400 flex items-center gap-2">
                      <FaUsers /> Members ({groupMembers.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {groupMembers.map((m) => (
                        <span
                          key={m.id}
                          className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                        >
                          {m.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  {group.budget && (
                    <div>
                      <h4 className="font-semibold mb-2 text-yellow-400 flex items-center gap-2">
                        <FaMoneyBillWave /> Budget
                      </h4>
                      <p className="text-2xl font-bold text-yellow-400">
                        ₹{group.budget}
                      </p>
                      <p className="text-sm text-gray-400">
                        Total Expenses: ₹{totalExpenses.toLocaleString("en-IN")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat + Messages */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="bg-[#1A1A1A]/80 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold text-yellow-400">Group Chat</h2>
          </div>

          <div className="h-[420px] overflow-y-auto p-4 space-y-3 bg-[#0A0A0A]/50">
            {normalMessages.length === 0 ? (
              <p className="text-center text-gray-500">
                No messages yet. Start chatting!
              </p>
            ) : (
              normalMessages.map((msg) => {
                const owesMatch = msg.text.match(
                  /(.+)\s+owes\s+(.+)\s+₹(\d+(\.\d+)?)/i
                );
                const canPay =
                  owesMatch &&
                  owesMatch[1].trim().toLowerCase() ===
                    loggedUser.name.toLowerCase();

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      msg.sender === loggedUser.name
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        msg.sender === loggedUser.name
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black"
                          : "bg-gray-800 text-white"
                      }`}
                    >
                      <p className="text-xs font-semibold mb-1 opacity-80">
                        {msg.sender === "System" ? "💬 System" : msg.sender}
                      </p>
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>

                      {/* 💳 Payment Button */}
                      {canPay && (
                        <button
                          onClick={() =>
                            handleOpenPayment(owesMatch[2], owesMatch[3])
                          }
                          className="mt-2 w-full bg-yellow-400 text-black text-sm font-semibold py-1 rounded-md hover:bg-yellow-300 transition"
                        >
                          Pay ₹{owesMatch[3]} to {owesMatch[2]}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-3 bg-[#0A0A0A] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-yellow-400/50 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg hover:from-yellow-300 hover:to-yellow-400 flex items-center gap-2"
              >
                <FaPaperPlane /> Send
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 💰 Payment Success Modal */}
      <AnimatePresence>
        {showPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4"
            onClick={() => setShowPayment(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl"
            >
              {paymentSuccess ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <FaCheck className="text-white text-3xl" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-green-400 mb-2">
                    Payment Successful 🎉
                  </h3>
                  <p className="text-gray-300">
                    You paid {paymentTo} ₹{paymentAmount}
                  </p>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                    Processing Payment...
                  </h3>
                  <p className="text-gray-300 mb-2">
                    Paying <span className="text-yellow-400">{paymentTo}</span>{" "}
                    ₹{paymentAmount}
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyGroup;
