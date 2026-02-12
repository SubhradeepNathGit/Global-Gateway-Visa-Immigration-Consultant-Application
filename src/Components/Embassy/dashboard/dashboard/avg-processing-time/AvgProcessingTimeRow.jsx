import React from "react";

const AvgProcessingTimeRow = ({ item }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">
          {item.type}
        </span>
        <span className="text-sm font-bold text-gray-900">
          {item.days} days
        </span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner">
        <div
          className={`${item.color} h-full rounded-full transition-all duration-700 shadow-sm`}
          style={{ width: `${item.percentage}%` }}
        />
      </div>
    </div>
  );
};

export default AvgProcessingTimeRow;
