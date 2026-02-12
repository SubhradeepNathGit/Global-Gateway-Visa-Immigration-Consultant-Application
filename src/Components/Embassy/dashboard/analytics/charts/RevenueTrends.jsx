import React from 'react'
import { Area, AreaChart, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const RevenueTrends = ({ setChartView, chartView, revenueData }) => {

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
            <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={revenueData}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => ['₹' + value.toLocaleString(), '']}
                    />
                    <Legend wrapperStyle={{ fontSize: '13px' }} />
                    {(chartView === 'revenue' || chartView === 'both') && (
                        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue (₹)" />
                    )}
                    {(chartView === 'applications' || chartView === 'both') && (
                        <Area type="monotone" dataKey="applications" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorApplications)" name="Applications" />
                    )}
                    <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default RevenueTrends