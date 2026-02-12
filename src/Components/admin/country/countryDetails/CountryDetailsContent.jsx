import React from 'react'
import { FileText } from 'lucide-react'

const CountryDetailsContent = ({ colors, sections, country }) => {
    return (
        <div className="p-6 space-y-6 bg-slate-900">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {sections.map(({ title, icon: Icon, color, items }) => (
                    <div key={title} className={`rounded-xl border ${colors[color]} bg-slate-800/40`}>
                        <div className="p-3 border-b border-slate-700/50 bg-slate-800/50">
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                <Icon className={`w-4 h-4 ${colors[color]}`} />
                                {title}
                            </h3>
                        </div>
                        <div className="p-3 space-y-2">
                            {items.map(({ label, value, icon: ItemIcon, mono }) =>
                                value ? (
                                    <div key={label} className="flex items-center justify-between gap-3 py-1 border-b border-slate-700/30 last:border-0">
                                        <div className="flex items-center gap-1 text-slate-400">
                                            {ItemIcon && <ItemIcon className="w-3 h-3" />}
                                            <span className="text-xs uppercase">{label}</span>
                                        </div>
                                        <div className={`text-sm text-slate-200 ${mono ? 'font-mono' : 'font-semibold'}`}>
                                            {value}
                                        </div>
                                    </div>
                                ) : null
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Text Content */}
            {(country?.description &&
                <div className="space-y-4">
                    <div className="rounded-xl border border-slate-700/50 bg-slate-800/40">
                        <div className="p-3 border-b border-slate-700/50 bg-slate-800/50">
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                <FileText className="w-4 h-4 text-violet-400" /> Description
                            </h3>
                        </div>
                        <div className="p-4">
                            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{country?.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CountryDetailsContent