import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaRocket, FaUsers, FaChartLine, FaFileExport, FaComments, FaCode, FaLightbulb, FaRoute, FaGithub, FaReact, FaNodeJs } from "react-icons/fa";
import { motion } from "framer-motion";

export default function About() {
  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser"));
    } catch {
      return null;
    }
  }, []);

  const features = [
    { icon: <FaUsers />, title: "Group Management", desc: "Create groups with budgets and members" },
    { icon: <FaChartLine />, title: "Expense Tracking", desc: "Add expenses with payer and date tracking" },
    { icon: <FaFileExport />, title: "Auto-Split", desc: "Automatically split bills equally among members" },
    { icon: <FaComments />, title: "Group Chat", desc: "Real-time messaging within groups" },
    { icon: <FaChartLine />, title: "Dashboard Analytics", desc: "Visual charts and balance tracking" },
    { icon: <FaFileExport />, title: "CSV Export", desc: "Export expenses for external analysis" },
  ];

  const techStack = [
    { name: "React", icon: <FaReact />, color: "text-blue-400" },
    { name: "Vite", icon: <FaCode />, color: "text-yellow-400" },
    { name: "Recharts", icon: <FaChartLine />, color: "text-green-400" },
    { name: "JSON Server", icon: <FaNodeJs />, color: "text-green-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] text-white pt-20 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 mb-4">
            About Expense Splitter
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Split expenses fairly. Stay organized. Settle easily.
          </p>
          {currentUser && (
            <div className="mt-4 inline-block px-4 py-2 bg-yellow-400/20 border border-yellow-400/30 rounded-lg text-sm text-gray-300">
              Logged in as <span className="text-yellow-400 font-semibold">{currentUser.name || currentUser.username || "User"}</span>
            </div>
          )}
        </motion.div>

        {/* What is Expense Splitter */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-gray-800 rounded-2xl p-8 mb-8 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <FaRocket className="text-3xl text-yellow-400" />
            <h2 className="text-3xl font-bold text-yellow-400">What is Expense Splitter?</h2>
          </div>
          <p className="text-gray-300 leading-7 text-lg">
            Expense Splitter is a modern, user-friendly application designed to simplify expense sharing 
            for trips, roommates, friends, or teams. Create groups, add expenses with who paid, 
            auto-split the bill equally, and track balances instantly across all pages. 
            Your data is stored in a JSON backend for easy development and offline-friendly demos.
          </p>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-gray-800 rounded-xl p-6 hover:border-yellow-400/50 transition group"
              >
                <div className="text-3xl text-yellow-400 mb-3 group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* How it Works */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-gray-800 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <FaRoute />
              How It Works
            </h2>
            <ol className="space-y-4">
              {[
                "Create a group, set a budget (optional), and add members by name.",
                "Add expenses with description, amount, who paid, and date.",
                "Expenses are automatically split equally among all group members.",
                "View your share and balances on the Dashboard with visual charts.",
                "Filter, sort, and export expenses to CSV for external analysis.",
                "Chat with group members in real-time within each group.",
              ].map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p className="text-gray-300 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </motion.section>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tech Stack */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-gray-800 rounded-2xl p-6 shadow-xl"
            >
              <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <FaCode />
                Tech Stack
              </h2>
              <div className="space-y-3">
                {techStack.map((tech, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-lg">
                    <span className={`text-2xl ${tech.color}`}>{tech.icon}</span>
                    <span className="text-gray-300 font-medium">{tech.name}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Tips */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-gray-800 rounded-2xl p-6 shadow-xl"
            >
              <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <FaLightbulb />
                Pro Tips
              </h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Use consistent member names that match login names for accurate share calculations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Refresh the Dashboard after adding large batches of expenses.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Use the Expenses page filters to find specific transactions quickly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Export expenses to CSV for external analysis or record keeping.</span>
                </li>
              </ul>
            </motion.section>

            {/* Roadmap */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-gray-800 rounded-2xl p-6 shadow-xl"
            >
              <h2 className="text-xl font-bold text-yellow-400 mb-4">Future Roadmap</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400">→</span>
                  <span>Settle-up suggestions (minimize transfers)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400">→</span>
                  <span>Expense categories & receipt attachments</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400">→</span>
                  <span>Recurring expenses automation</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400">→</span>
                  <span>Mobile app version</span>
                </li>
              </ul>
            </motion.section>
          </div>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/groups"
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition shadow-lg shadow-yellow-400/20 text-center"
          >
            Create a Group
          </Link>
          <Link
            to="/expenses"
            className="px-8 py-4 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition border border-gray-700 text-center"
          >
            View Expenses
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
