import React from 'react'
import { Pie, ResponsiveContainer,PieChart as RechartsPie, Cell, Tooltip } from 'recharts'

const VisaTypeDistribution = ({visaTypeData}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Visa Type Distribution</h2>
            <p className="text-sm text-gray-600 mb-6">Revenue and application breakdown by visa category</p>
            <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                    <RechartsPie>
                        <Pie
                            data={visaTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            innerRadius={70}
                            outerRadius={110}
                            dataKey="value"
                            style={{ fontSize: '11px', fontWeight: '600' }}
                        >
                            {visaTypeData?.map((entry, index) => (
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