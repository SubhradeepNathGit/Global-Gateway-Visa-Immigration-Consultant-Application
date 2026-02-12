import { Calendar } from 'lucide-react'
import React from 'react'

const AnalyticsHeader = () => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
                <p className="text-slate-400">Deep insights into visa applications and trends</p>
            </div>
            <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 text-white text-sm transition-all flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Last 12 months
                </button>
            </div>
        </div>
    )
}

export default AnalyticsHeader