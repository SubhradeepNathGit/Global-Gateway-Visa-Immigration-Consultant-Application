import React from 'react'

const StatsCard = ({ stat }) => {
    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon size={24} />
                </div>
            </div>
        </div>
    )
}

export default StatsCard