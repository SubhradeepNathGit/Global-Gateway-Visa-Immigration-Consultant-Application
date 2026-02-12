import React from 'react'
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const WeeklyPerformance = ({ weeklyData }) => {

    const chartData = {
        labels: weeklyData?.map(d => d.day) || [],
        datasets: [
            {
                label: 'Applications',
                data: weeklyData?.map(d => d.applications) || [],
                backgroundColor: '#3b82f6',
                borderRadius: 8,
                borderSkipped: false,
            },
            {
                label: 'Approvals',
                data: weeklyData?.map(d => d.approvals) || [],
                backgroundColor: '#10b981',
                borderRadius: 8,
                borderSkipped: false,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    font: {
                        size: 12
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
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
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
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Weekly Performance</h2>
            <p className="text-sm text-gray-600 mb-6">Daily applications and revenue this week</p>
            <div style={{ height: '300px' }}>
                <Bar data={chartData} options={options} />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
                {[
                    { label: 'Total Applications', value: weeklyData?.reduce((sum, d) => sum + d.applications, 0), color: 'text-blue-600' },
                    { label: 'Approved', value: weeklyData?.reduce((sum, d) => sum + d.approvals, 0), color: 'text-green-600' },
                    { label: 'Revenue', value: `₹${(weeklyData?.reduce((sum, d) => sum + d.revenue, 0) / 1000).toFixed(0)}K`, color: 'text-purple-600' }
                ].map((stat, idx) => (
                    <div
                        key={idx}
                        className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                        <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                        <p className={`text-lg font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default WeeklyPerformance