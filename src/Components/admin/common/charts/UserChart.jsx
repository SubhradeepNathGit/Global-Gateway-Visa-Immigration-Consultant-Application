"use client";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { useApplicationsChartFormatted } from "../../../../hooks/useApplicationsChartFormatted";
import { Loader2 } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
);

export function UserChart() {
  const { chartData, isLoading } = useApplicationsChartFormatted();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "#fff",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(59, 130, 246, 0.3)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(255, 255, 255, 0.05)" },
      },
      y: {
        ticks: { color: "#94a3b8" },
        beginAtZero: true,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-14 h-14 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!chartData) {
        return (
            <div className="text-slate-400 text-center py-6">
                No application data available.
            </div>
        );
    }

  return (
    <div className="w-full h-full min-h-[200px] sm:min-h-[250px]">
      {chartData && <Line data={chartData} options={chartOptions} />}
    </div>
  );
}