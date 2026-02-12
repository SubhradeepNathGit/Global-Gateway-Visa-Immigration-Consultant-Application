import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';
import { useRevenueTrend } from '../../../tanstack/query/getRevenueTrend';
import { Loader2 } from 'lucide-react';
import { buildMonthlyData } from '../../../util/analytics/MonthlyTransaction';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function RevenueTrendChart() {

  const [activeView, setActiveView] = useState("revenue");
  const { data, isLoading } = useRevenueTrend();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
      </div>
    );
  }

  const { revenue = [], purchases = [] } = buildMonthlyData(data || []);

  const getChartData = () => {
    if (activeView === "revenue") {
      return {
        labels: MONTHS,
        datasets: [
          {
            label: "Revenue (Visa)",
            data: revenue,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59,130,246,0.15)",
            fill: true,
          },
        ],
      };
    }

    if (activeView === "purchases") {
      return {
        labels: MONTHS,
        datasets: [
          {
            label: "Course Purchases",
            data: purchases,
            borderColor: "#22c55e",
            backgroundColor: "rgba(34,197,94,0.15)",
            fill: true,
          },
        ],
      };
    }

    return {
      labels: MONTHS,
      datasets: [
        {
          label: "Revenue (Visa)",
          data: revenue,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.15)",
          fill: false,
          yAxisID: "y",
        },
        {
          label: "Course Purchases",
          data: purchases,
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.15)",
          fill: false,
          yAxisID: "y1",
        },
      ],
    };

  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#9ca3af",
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed.y;
            if (ctx.dataset.label.includes("Revenue")) {
              return `₹${value.toLocaleString()}`;
            }
            return `${value} purchases`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#6b7280",
          callback: (v) => `₹${v / 1000}k`,
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
      y1: {
        beginAtZero: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: "#6b7280",
        },
      },
      x: {
        ticks: {
          color: "#6b7280",
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
    },
  };

  return (
    <div className=" border border-gray-700/50 rounded-lg shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-md font-semibold text-gray-100">
            Revenue & Course Purchase Trend
          </h2>
          <p className="text-sm text-gray-400 mt-1">Monthly performance overview for 2025</p>
        </div>
        <div className="flex gap-2 bg-gray-700 rounded-lg p-1" style={{ backgroundColor: '#334155' }}>
          <button
            onClick={() => setActiveView('revenue')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeView === 'revenue'
              ? 'bg-gray-600 text-white shadow'
              : 'text-gray-300 hover:text-white'
              }`}
            style={activeView === 'revenue' ? { backgroundColor: '#475569' } : {}}
          >
            Revenue
          </button>
          <button
            onClick={() => setActiveView('purchases')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeView === 'purchases'
              ? 'bg-blue-600 text-white shadow'
              : 'text-gray-300 hover:text-white'
              }`}
          >
            Course Purchases
          </button>
          <button
            onClick={() => setActiveView('both')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeView === 'both'
              ? 'bg-gray-600 text-white shadow'
              : 'text-gray-300 hover:text-white'
              }`}
            style={activeView === 'both' ? { backgroundColor: '#475569' } : {}}
          >
            Both
          </button>
        </div>
      </div>
      <div style={{ height: '400px' }}>
        <Line data={getChartData()} options={options} />
      </div>
    </div>
  );
}