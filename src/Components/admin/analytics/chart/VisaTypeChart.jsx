import React, { useMemo } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Filler, Legend } from "chart.js";
import { useVisaTypeStats } from "../../../../tanstack/query/getVisaTypeStats";
import { Doughnut } from "react-chartjs-2";
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

export function VisaTypeChart() {
    const { data, isLoading } = useVisaTypeStats();

    // Always compute labels & values (safe even if undefined)
    const labels = Object.keys(data || {});
    const values = Object.values(data || {});

    const generateColors = (count) => {
        const colors = ["#5B8FF9", "#FF9F40", "#5AD8A6", "#F6BD16", "#9270CA", "#FF6B6B", "#36CFC9",
            "rgba(59,130,246,0.8)",
            "rgba(16,185,129,0.8)",
            "rgba(245,158,11,0.8)",
            "rgba(139,92,246,0.8)",
            "rgba(6,182,212,0.8)",
            "rgba(239,68,68,0.8)",
            "rgba(168,85,247,0.8)",
        ];
        return colors.slice(0, count);
    };

    // Hooks must run unconditionally
    const chartData = useMemo(
        () => ({
            labels,
            datasets: [
                {
                    label: "Applications Count",
                    data: values,
                    backgroundColor: generateColors(labels.length),
                    borderColor: "#1e293b",
                    borderWidth: 2,
                },
            ],
        }),
        [labels, values]
    );

    const chartOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        color: "#94a3b8",
                        padding: 15,
                        font: { size: 12, weight: "500" },
                    },
                },
                tooltip: {
                    backgroundColor: "rgba(17,24,39,0.95)",
                    titleColor: "#fff",
                    bodyColor: "#cbd5e1",
                    borderColor: "rgba(59,130,246,0.3)",
                    borderWidth: 1,
                    padding: 12,
                    bodyFont: { size: 13, weight: "600" },
                    callbacks: {
                        label: (ctx) =>
                            `${ctx.label}: ${ctx.parsed.toLocaleString()}`,
                    },
                },
            },
        }),
        []
    );

    // AFTER hooks → now you can conditionally return UI
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-40">
                <Loader2 className="w-14 h-14 animate-spin text-blue-400" />
            </div>
        );
    }

    if (!labels.length) {
        return (
            <div className="text-slate-400 text-center py-6">
                No visa application data available.
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[300px] flex items-center justify-center">
            <Doughnut data={chartData} options={chartOptions} />
        </div>
    );
}