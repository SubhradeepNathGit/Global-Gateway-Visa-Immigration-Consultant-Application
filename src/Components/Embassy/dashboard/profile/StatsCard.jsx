import React from 'react'

const StatsCard = ({ stat }) => {
    return (
        <div className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.iconColor} flex items-center justify-center`}>
                    <stat.icon size={24} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stat.changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                    {stat.change}
                </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.label}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
        </div>
    )
}

export default StatsCard