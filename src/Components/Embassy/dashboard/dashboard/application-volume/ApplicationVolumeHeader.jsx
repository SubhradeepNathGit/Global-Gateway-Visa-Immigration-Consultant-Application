import { TrendingDown, TrendingUp } from 'lucide-react'
import React from 'react'

const ApplicationVolumeHeader = ({ change, trend }) => {

    const Icon = trend == 'down' ? TrendingDown : TrendingUp

    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">Application Volume</h2>
                <p className="text-sm text-gray-600 mt-1">Monthly trends for 2025</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 bg-green-50 ${trend == 'up' ? 'text-green-700' : trend == 'down' ? 'text-red-700' : 'text-orange-400'} rounded-lg border border-green-200`}>
                <Icon size={16} />
                <span className="text-sm font-semibold">{trend == 'up' ? '+' : trend == 'down' ? '-' : ''}{change}</span>
            </div>
        </div>
    )
}

export default ApplicationVolumeHeader