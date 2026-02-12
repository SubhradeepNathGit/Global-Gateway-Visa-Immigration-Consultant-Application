import React from "react";

export default function StatCard({ title, value, delta, children }) {
  return (
    <div className="p-4 rounded-2xl bg-white/3 border border-white/5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-300">{title}</div>
          <div className="text-2xl font-semibold">{value}</div>
        </div>
        <div className="text-sm text-green-400">{delta}</div>
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
