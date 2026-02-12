import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useCourseEnrollments } from '../../../../tanstack/query/getCourseEnrollments';
import { Loader2 } from 'lucide-react';

export default function CoursePurchaseChart() {

  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const COLORS = ["#FF6B6B", "#36CFC9", "#5AD8A6", "#9270CA", "#5B8FF9", "#F6BD16",
    "rgba(59,130,246,0.8)",
    "rgba(16,185,129,0.8)",
    "rgba(245,158,11,0.8)",
    "rgba(139,92,246,0.8)",
    "rgba(6,182,212,0.8)",
    "rgba(239,68,68,0.8)",
    "rgba(168,85,247,0.8)"];

  const { data = [], isLoading } = useCourseEnrollments({ status: "success" });

  const coursePurchaseData = data.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length],
  }));

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const total = coursePurchaseData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-[#0f1419] border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold">{payload[0].name}</p>
          <p className="text-blue-400">{payload[0].value} enrollments</p>
          <p className="text-gray-400 text-sm">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-14 h-14 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg p-6 border border-gray-700/50 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
    >
      <div className="mb-6">
        <h3 className="text-mdi font-semibold text-white mb-1">Visa Course Enrollments</h3>
        <p className="text-gray-400 text-sm">Distribution of enrollments by visa immigration course</p>
      </div>

      <div className="relative" style={{ height: '320px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={coursePurchaseData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={140}
              paddingAngle={2}
              dataKey="value"
              animationBegin={200}
              animationDuration={1000}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {coursePurchaseData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                  style={{
                    transition: 'all 0.3s ease',
                    filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              {total.toLocaleString()}
            </p>
            <p className="text-gray-400 text-sm mt-1">Total Enrollments</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {coursePurchaseData?.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-800/30 transition-colors cursor-pointer"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-gray-300 text-sm font-medium truncate">{item.name}</p>
              <p className="text-gray-500 text-xs">
                {item.value.toLocaleString()} buyers
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}