import React from 'react'
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const RevenueTrends = ({ setChartView, chartView, revenueData }) => {

    const datasets = [];

    if (chartView === 'revenue' || chartView === 'both') {
        datasets.push({
            label: 'Revenue (₹)',
            data: revenueData?.map(d => d.revenue) || [],
            borderColor: '#3b82f6',
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 320);
                gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
                gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
                return gradient;
            },
            borderWidth: 2.5,
            fill: true,
            tension: 0.4,
        });
    }

    if (chartView === 'applications' || chartView === 'both') {
        datasets.push({
            label: 'Applications',
            data: revenueData?.map(d => d.applications) || [],
            borderColor: '#10b981',
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 320);
                gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
                gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');
                return gradient;
            },
            borderWidth: 2.5,
            fill: true,
            tension: 0.4,
        });
    }

    datasets.push({
        label: 'Target',
        data: revenueData?.map(d => d.target) || [],
        borderColor: '#f59e0b',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        pointRadius: 0,
    });

    const chartData = {
        labels: revenueData?.map(d => d.month) || [],
        datasets: datasets
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    font: {
                        size: 13
                    }
                }
            },
            tooltip: {
                backgroundColor: '#fff',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                titleColor: '#111827',
                bodyColor: '#374151',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.dataset.label.includes('Revenue')) {
                            label += '₹' + context.parsed.y.toLocaleString();
                        } else {
                            label += context.parsed.y;
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: '#e5e7eb',
                    drawBorder: false,
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                grid: {
                    color: '#e5e7eb',
                    drawBorder: false,
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12
                    }
                }
            }
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Revenue & Applications Trend</h2>
                    <p className="text-sm text-gray-600 mt-1">Monthly performance overview for 2025</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => setChartView('revenue')}
                        className={`flex-1 sm:flex-none px-4 py-2 text-sm rounded-lg font-medium transition-all ${chartView === 'revenue'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        Revenue
                    </button>
                    <button
                        onClick={() => setChartView('applications')}
                        className={`flex-1 sm:flex-none px-4 py-2 text-sm rounded-lg font-medium transition-all ${chartView === 'applications'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        Applications
                    </button>
                    <button
                        onClick={() => setChartView('both')}
                        className={`flex-1 sm:flex-none px-4 py-2 text-sm rounded-lg font-medium transition-all ${chartView === 'both'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        Both
                    </button>
                </div>
            </div>
            <div style={{ height: '320px' }}>
                <Line data={chartData} options={options} />
            </div>
        </div>
    )
}

export default RevenueTrends