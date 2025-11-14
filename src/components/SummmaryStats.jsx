import React from "react";

export default function BalanceTable({ expenses = [], groupMembers = [] }) {
  if (!expenses.length) return null;

  const members = {};
  groupMembers.forEach((m) => {
    members[m] = { paid: 0, owes: 0 };
  });

  // Calculate each member's paid & owed
  expenses.forEach((exp) => {
    const amountPerMember = exp.amount / groupMembers.length;

    // Add owes for everyone
    groupMembers.forEach((m) => {
      members[m].owes += amountPerMember;
    });

    // Add paid amount for payer
    if (members[exp.paidBy]) {
      members[exp.paidBy].paid += Number(exp.amount);
    } else {
      // if not part of members list, add manually
      members[exp.paidBy] = { paid: Number(exp.amount), owes: 0 };
    }
  });

  const entries = Object.entries(members);

  return (
    <div className="mt-6 bg-[#1C1C1C] p-4 rounded-xl border border-yellow-500/20 text-yellow-300">
      <h3 className="text-lg font-bold mb-3">Per-Person Balance</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-yellow-500/20">
            <th className="text-left">Member</th>
            <th>Paid</th>
            <th>Owes</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([name, data]) => (
            <tr key={name} className="border-b border-yellow-500/10">
              <td className="text-left py-1">{name}</td>
              <td>₹{data.paid.toFixed(2)}</td>
              <td>₹{data.owes.toFixed(2)}</td>
              <td
                className={
                  data.paid - data.owes >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                ₹{(data.paid - data.owes).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
