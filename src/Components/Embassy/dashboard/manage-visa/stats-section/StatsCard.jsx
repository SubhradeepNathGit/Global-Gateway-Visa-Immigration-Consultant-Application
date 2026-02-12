import React from 'react'

const StatsCard = ({ stat }) => {
    const Icon = stat?.icon;
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">{stat?.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat?.count}</p>
                    <p className={`text-xs ${stat?.subtitleColor} mt-1`}>{stat?.subTitle}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${stat?.iconColor} `} />
                </div>
            </div>
        </div>
    )
}

export default StatsCard