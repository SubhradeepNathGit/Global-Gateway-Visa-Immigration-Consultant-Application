import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useCourseRevenue } from '../../../../tanstack/query/getCourseRevenue';
import { Loader2 } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CourseRevenueChart() {

  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const COLORS = ["#5B8FF9", "#5AD8A6", "#F6BD16", "#9270CA", "#FF6B6B", "#36CFC9", "#FF9F40",
    "rgba(16,185,129,0.8)",
    "rgba(59,130,246,0.8)",
    "rgba(168,85,247,0.8)",
    "rgba(245,158,11,0.8)",
    "rgba(6,182,212,0.8)",
    "rgba(139,92,246,0.8)",
    "rgba(239,68,68,0.8)",
  ];

  const { data: revenueData = [], isLoading } = useCourseRevenue({ status: "success" });

  const total = revenueData.reduce((sum, item) => sum + item.value, 0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const chartData = revenueData.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length],
  }));

  const formatCurrency = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}k`;
    }
    return `₹${value}`;
  };

  const data = {
    labels: chartData.map(item => item.name),
    datasets: [{
      data: chartData.map(item => item.value),
      backgroundColor: chartData.map(item => item.color),
      borderColor: '#fff',
      borderWidth: 2,
      hoverOffset: 10,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0f1419',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#10b981',
        callbacks: {
          label: function (context) {
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${formatCurrency(context.parsed)} (${percentage}%)`;
          }
        }
      }
    },
    onHover: (event, activeElements) => {
      if (activeElements.length > 0) {
        setActiveIndex(activeElements[0].index);
      } else {
        setActiveIndex(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-14 h-14 animate-spin text-blue-400" />
      </div>
    )
  }

  return (
    <div
      className={`rounded-lg p-6 border border-gray-700/50 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
    >
      <div className="mb-6">
        <h3 className="text-md font-semibold text-white mb-1">Visa Course Revenue</h3>
        <p className="text-gray-400 text-sm">Revenue breakdown by visa immigration course</p>
      </div>

      <div className="relative" style={{ height: '320px' }}>
        <Doughnut data={data} options={options} />

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              {formatCurrency(total)}
            </p>
            <p className="text-gray-400 text-sm mt-1">Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {chartData?.map((item, index) => (
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
                {formatCurrency(item.value)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}