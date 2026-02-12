import React from 'react'
import { ResponsiveContainer,PieChart as RechartsPie, Pie, Tooltip, Cell } from 'recharts'

const ApplicationStatus = ({applicationStatusData}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Application Status Overview</h2>
            <p className="text-sm text-gray-600 mb-6">Current status distribution of all applications</p>
            <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                    <RechartsPie>
                        <Pie
                            data={applicationStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${(percent * 100).toFixed(1)}%`}
                            outerRadius={110}
                            dataKey="value"
                            style={{ fontSize: '12px', fontWeight: '700' }}
                        >
                            {applicationStatusData?.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value) => [value + ' applications', '']}
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                    </RechartsPie>
                </ResponsiveContainer>
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