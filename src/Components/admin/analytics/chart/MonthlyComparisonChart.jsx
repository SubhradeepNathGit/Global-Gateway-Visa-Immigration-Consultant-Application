import React, { useMemo } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Filler, Legend } from "chart.js";
import { useMonthlyApplicationStats } from "../../../../tanstack/query/getMonthlyApplicationStats";
import { Bar } from "react-chartjs-2";
import { Loader2 } from "lucide-react";

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

export function MonthlyComparisonChart() {
    const { data, isLoading } = useMonthlyApplicationStats();

    const safeData = data ?? {
        currentYear: "",
        prevYear: "",
        currentYearData: Array(12).fill(0),
        prevYearData: Array(12).fill(0),
    };

    const { currentYear, prevYear, currentYearData, prevYearData } = safeData;

    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const chartData = useMemo(
        () => ({
            labels: monthLabels,
            datasets: [
                {
                    label: currentYear || "Current Year",
                    data: currentYearData,
                    backgroundColor: "rgba(59, 130, 246, 0.8)",
                    borderColor: "#3b82f6",
                    borderWidth: 2,
                },
                {
                    label: prevYear || "Previous Year",
                    data: prevYearData,
                    backgroundColor: "rgba(100, 116, 139, 0.5)",
                    borderColor: "#64748b",
                    borderWidth: 2,
                },
            ],
        }),
        [currentYear, currentYearData, prevYear, prevYearData]
    );

    const chartOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                },
            },
            scales: {
                y: { beginAtZero: true },
            },
        }),
        []
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-40">
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
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
        <div className="w-full h-full min-h-[250px]">
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
}
