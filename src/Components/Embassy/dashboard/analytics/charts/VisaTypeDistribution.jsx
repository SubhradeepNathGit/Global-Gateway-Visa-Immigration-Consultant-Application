import React from 'react'
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const VisaTypeDistribution = ({ visaTypeData }) => {

    const chartData = {
        labels: visaTypeData?.map(item => item.name) || [],
        datasets: [{
            data: visaTypeData?.map(item => item.value) || [],
            backgroundColor: visaTypeData?.map(item => item.color) || [],
            borderColor: '#fff',
            borderWidth: 2,
            hoverOffset: 8,
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '50%',
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
                        return `${context.parsed} applications`;
                    }
                }
            }
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Visa Type Distribution</h2>
            <p className="text-sm text-gray-600 mb-6">Revenue and application breakdown by visa category</p>
            <div className="flex items-center justify-center" style={{ height: '300px' }}>
                <Doughnut data={chartData} options={options} />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
                {visaTypeData?.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
                    >
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                            <p className="text-xs text-gray-600">₹{(item.revenue / 1000).toFixed(0)}K</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    )
}

export default VisaTypeDistribution