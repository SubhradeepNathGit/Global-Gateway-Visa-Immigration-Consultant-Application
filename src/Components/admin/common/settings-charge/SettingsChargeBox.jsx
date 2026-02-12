import React from 'react'

const SettingsChargeBox = ({ title, description, icon: Icon, children, className = "" }) => {
  return (
    <div className={`flex flex-col p-5 sm:p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 ${className}`}>
      <div className="flex items-start gap-3 mb-4 sm:mb-5 flex-shrink-0">
        <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 flex-shrink-0">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-1">{title}</h3>
          {description && <p className="text-sm text-slate-400">{description}</p>}
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        {children}
      </div>
    </div>
  );
}

export default SettingsChargeBox