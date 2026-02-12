import { useMemo } from "react";
import { useApplicationsChart } from "../tanstack/query/getApplicationsChartData";

export function useApplicationsChartFormatted() {
    const { data, isLoading, error } = useApplicationsChart();

    const formatted = useMemo(() => {
        if (!data) return null;

        return {
            labels: data.map((item) => item.month_short),
            datasets: [
                {
                    label: "Applications",
                    data: data.map((item) => item.count),
                    fill: true,
                    borderColor: "#3b82f6",
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: "#3b82f6",
                    pointHoverBorderColor: "#fff",
                    pointHoverBorderWidth: 3,
                    pointHitRadius: 10,
                    backgroundColor: (ctx) => {
                        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, "rgba(59, 130, 246, 0.25)");
                        gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.10)");
                        gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
                        return gradient;
                    },
                },
            ],
        };
    }, [data]);

    return { chartData: formatted, isLoading, error };
}