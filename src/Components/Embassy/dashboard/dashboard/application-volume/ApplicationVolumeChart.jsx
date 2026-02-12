import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

export default function ApplicationVolumeChart({ chartData, maxValue }) {
    const labels = chartData.map(d => d.month);
    const values = chartData.map(d => d.value);

    const data = {
        labels,
        datasets: [
            {
                data: values,
                borderColor: "#2563eb",
                borderWidth: 3,
                tension: 0.4,
                fill: false,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: "#2563eb",
                pointBorderColor: "#fff",
                pointBorderWidth: 2
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
        },

        scales: {
            x: {
                offset: false,
                grid: { display: false },
                ticks: {
                    color: "#64748b",
                    font: { size: 12 }
                }
            },
            y: {
                beginAtZero: true,
                suggestedMax: maxValue + 1,
                grid: { color: "#e5e7eb" },
                ticks: {
                    color: "#64748b",
                    stepSize: 1
                }
            }
        }
    };

    return (
        <div className="h-[260px]">
            <Line data={data} options={options} />
        </div>
    );
}
