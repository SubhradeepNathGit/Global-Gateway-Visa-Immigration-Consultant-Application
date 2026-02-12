"use client";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend, } from "chart.js";
import { useApprovalRateChart } from "../../../../tanstack/query/getApprovalRateChartData";
import { Loader2 } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

export function RevenueChart() {
  const { data, isLoading } = useApprovalRateChart();

  const chartData = useMemo(() => {
    if (!data) return { labels: [], datasets: [] };

    return {
      labels: data.months,
      datasets: [
        {
          label: "Approval Rate",
          data: data.approvalRates,
          fill: true,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, "rgba(6, 182, 212, 0.3)");
            gradient.addColorStop(0.5, "rgba(6, 182, 212, 0.1)");
            gradient.addColorStop(1, "rgba(6, 182, 212, 0)");
            return gradient;
          },
          borderColor: "#06b6d4",
          borderWidth: 2.5,
          tension: 0.4,
          pointBackgroundColor: "#06b6d4",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: "#06b6d4",
          pointHoverBorderColor: "#fff",
          pointHoverBorderWidth: 3,
        },
      ],
    };
  }, [data]);

  const chartOptions = useMemo(() => ({
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
        borderColor: "rgba(6, 182, 212, 0.3)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        titleFont: { size: 13, weight: "600" },
        bodyFont: { size: 14, weight: "bold" },
        callbacks: {
          label: (ctx) => `Approval Rate: ${ctx.parsed.y}%`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8", font: { size: 11, weight: "500" }, padding: 8 },
        grid: { color: "rgba(255,255,255,0.05)", drawBorder: false },
        border: { display: false },
      },
      y: {
        ticks: {
          color: "#94a3b8",
          font: { size: 11, weight: "500" },
          padding: 8,
          callback: (value) => `${value}%`,
        },
        grid: { color: "rgba(255,255,255,0.05)", drawBorder: false },
        beginAtZero: false,
        min: 0,
        max: 100,
      },
    },
    animation: { duration: 750, easing: "easeInOutQuart" },
  }), []);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-14 h-14 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!data) {
        return (
            <div className="text-slate-400 text-center py-6">
                No application data available.
            </div>
        );
    }

  return (
    <div className="w-full h-full min-h-[200px] sm:min-h-[250px]">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}