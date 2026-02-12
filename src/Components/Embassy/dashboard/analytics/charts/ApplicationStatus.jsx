import React from 'react'
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ApplicationStatus = ({ applicationStatusData }) => {

    const chartData = {
        labels: applicationStatusData?.map(item => item.name) || [],
        datasets: [{
            data: applicationStatusData?.map(item => item.value) || [],
            backgroundColor: applicationStatusData?.map(item => item.color) || [],
            borderColor: '#fff',
            borderWidth: 2,
            hoverOffset: 8,
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
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
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((context.parsed / total) * 100).toFixed(1);
                        return `${context.parsed} applications (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Application Status Overview</h2>
            <p className="text-sm text-gray-600 mb-6">Current status distribution of all applications</p>
            <div className="flex items-center justify-center" style={{ height: '300px' }}>
                <Pie data={chartData} options={options} />
            </div>
            <div className="grid grid-cols-1 gap-2.5 mt-4">
                {applicationStatusData?.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                        </div>
                        <p className="text-base font-bold text-gray-900">{item.value}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ApplicationStatus