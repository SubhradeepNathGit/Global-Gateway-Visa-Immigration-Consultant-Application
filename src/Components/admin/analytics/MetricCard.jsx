import React from 'react'

const MetricCard = ({ title, value, change, Icon, iconColor }) => {
    const isPositive = typeof change === "string" && change.startsWith("+");

    return (
        <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70 transition-all">
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <span className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {change}
                </span>
            </div>
            <div className="text-slate-400 text-sm mb-1">{title}</div>
            <div className="text-2xl font-bold text-white">{value}</div>
        </div>
    );
}

export default MetricCard;
