import React from 'react'

const CountryDetailsStats = ({ colors, stats }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-700/20 border-y border-slate-700/50">
            {stats.map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-slate-800/50 p-4 hover:bg-slate-800/70 transition-colors">
                    <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${colors[color]}`} />
                        <div>
                            <p className="text-xs text-slate-400 uppercase">{label}</p>
                            <p className="text-sm font-semibold text-white">{value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CountryDetailsStats