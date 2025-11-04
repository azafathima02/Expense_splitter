import React, { useState, useRef, useEffect } from "react";
import { Send, Plus } from "lucide-react";

const MyGroup = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const group = {
    name: "Trip to Goa",
    description: "Expense sharing group for our Goa trip!",
    members: ["Sree", "Ananya", "Rahul", "Vikram"],
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "You" }]);
      setInput("");
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white flex flex-col pt-[70px]">
      {/* Group name bar */}
      <div
        className="bg-[#1C1C1C] px-6 py-4 cursor-pointer flex justify-between items-center shadow-md"
        onClick={() => setShowDetails(!showDetails)}
      >
        <h2 className="text-lg font-semibold">{group.name}</h2>
        <span className="text-[#FFC300] text-sm">
          {showDetails ? "▲ Hide Info" : "▼ View Info"}
        </span>
      </div>

      {/* Drop-down for description and members */}
      {showDetails && (
        <div className="bg-[#1C1C1C] border-b border-[#E0E0E0]/20 px-6 py-3">
          <p className="text-[#E0E0E0] mb-2 text-sm">
            <span className="font-semibold text-white">Description: </span>
            {group.description}
          </p>
          <p className="text-[#E0E0E0] text-sm">
            <span className="font-semibold text-white">Members: </span>
            {group.members.join(", ")}
          </p>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-[#E0E0E0]/50 mt-10">
            No messages yet. Start a chat below!
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  msg.sender === "You"
                    ? "bg-[#FFC300] text-black"
                    : "bg-[#1C1C1C] text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex items-center p-4 bg-[#1C1C1C] border-t border-[#E0E0E0]/10">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-transparent outline-none border border-[#E0E0E0]/20 rounded-full px-4 py-2 text-sm text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="ml-3 text-[#FFC300] hover:text-white transition"
        >
          <Send size={22} />
        </button>
        <button
          onClick={() => (window.location.href = "/expenses")}
          className="ml-3 text-[#FFC300] hover:text-white transition"
        >
          <Plus size={22} />
        </button>
      </div>
    </div>
  );
};

export default MyGroup;
