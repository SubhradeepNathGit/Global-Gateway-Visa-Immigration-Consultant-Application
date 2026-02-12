import React from "react";

export default function SmallCard({ title, value }) {
  return (
    <div className="p-3 rounded-xl bg-white/3 border border-white/5">
      <div className="text-xs text-gray-300">{title}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
