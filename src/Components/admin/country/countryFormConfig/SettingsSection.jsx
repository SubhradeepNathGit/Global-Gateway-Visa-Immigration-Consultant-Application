import React from 'react'

const SettingsSection = ({ title, description, icon: Icon, children }) => {
    return (
        <div className="p-5 sm:p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-start gap-3 mb-4 sm:mb-5">
                <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30"><Icon className="w-5 h-5 text-blue-400" /></div>
                <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1">{title}</h3>
                    {description && <p className="text-sm text-slate-400">{description}</p>}
                </div>
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    )
}

export default SettingsSection