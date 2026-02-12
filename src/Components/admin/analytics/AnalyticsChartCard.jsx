import React from 'react'

const AnalyticsChartCard = ({ title, subtitle, children, actions }) => {
    return (
        <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-all">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
                    {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
                </div>
                {actions && <div className="flex gap-2">{actions}</div>}
            </div>
            <div className="h-64 lg:h-80">{children}</div>
        </div>
    );
}

export default AnalyticsChartCard