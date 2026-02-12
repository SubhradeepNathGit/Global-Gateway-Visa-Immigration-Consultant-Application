import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Filler,
  Legend
);

export function ApplicationTrendChart() {
    const chartData = useMemo(
        () => ({
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
                {
                    label: "Applications",
                    data: [120, 200, 150, 280, 190, 320, 280, 350, 310, 420, 380, 450],
                    fill: true,
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, "rgba(59, 130, 246, 0.25)");
                        gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.1)");
                        gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
                        return gradient;
                    },
                    borderColor: "#3b82f6",
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: "#3b82f6",
                    pointHoverBorderColor: "#fff",
                    pointHoverBorderWidth: 3,
                    pointHitRadius: 10,
                },
            ],
        }),
        []
    );

    const chartOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false,
            },
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
                    titleFont: { size: 13, weight: "600" },
                    bodyFont: { size: 14, weight: "bold" },
                    callbacks: {
                        label: function (context) {
                            return "Applications: " + context.parsed.y.toLocaleString();
                        },
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: "#94a3b8",
                        font: { size: 11, weight: "500" },
                        padding: 8,
                    },
                    grid: { color: "rgba(255, 255, 255, 0.05)", drawBorder: false },
                    border: { display: false },
                },
                y: {
                    ticks: {
                        color: "#94a3b8",
                        font: { size: 11, weight: "500" },
                        padding: 8,
                        callback: function (value) {
                            return value >= 1000 ? (value / 1000).toFixed(1) + "k" : value;
                        },
                    },
                    grid: { color: "rgba(255, 255, 255, 0.05)", drawBorder: false },
                    border: { display: false },
                    beginAtZero: true,
                },
            },
            animation: { duration: 750, easing: "easeInOutQuart" },
        }),
        []
    );

    return (
        <div className="w-full h-full min-h-[250px]">
            <Line data={chartData} options={chartOptions} />
        </div>
    );
}