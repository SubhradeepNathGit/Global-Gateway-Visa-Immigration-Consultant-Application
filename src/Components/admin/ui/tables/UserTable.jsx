import React from "react";

const sample = [
  { id: 1, name: "Aisha Khan", email: "aisha@example.com", role: "User", status: "Active" },
  { id: 2, name: "Ravi Patel", email: "ravi@example.com", role: "Admin", status: "Active" },
  { id: 3, name: "Mayu Tanaka", email: "mayu@example.com", role: "User", status: "Suspended" },
];

export default function UserTable() {
  return (
    <div className="overflow-x-auto bg-white/3 rounded-2xl border border-white/5">
      <table className="min-w-full divide-y divide-white/5">
        <thead className="text-left text-sm text-gray-300">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-200">
          {sample.map((u) => (
            <tr key={u.id} className="border-t border-white/5 hover:bg-white/2">
              <td className="px-4 py-3">{u.name}</td>
              <td className="px-4 py-3">{u.email}</td>
              <td className="px-4 py-3">{u.role}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs ${u.status === "Active" ? "bg-green-600/30" : "bg-rose-600/30"}`}>
                  {u.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <button className="px-3 py-1 rounded-md border border-white/5 text-sm">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
