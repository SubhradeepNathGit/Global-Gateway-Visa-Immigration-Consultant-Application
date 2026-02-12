import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const WeeklyPerformance = ({ weeklyData }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Weekly Performance</h2>
            <p className="text-sm text-gray-600 mb-6">Daily applications and revenue this week</p>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="applications" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Applications" />
                    <Bar dataKey="approvals" fill="#10b981" radius={[8, 8, 0, 0]} name="Approvals" />
                </BarChart>
            </ResponsiveContainer>
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