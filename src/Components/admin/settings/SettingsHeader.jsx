import React from 'react'

const SettingsHeader = () => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings and Privacy</h1>
                <p className="text-slate-400">Manage your application preferences and configurations</p>
            </div>
        </div>
    )
}

export default SettingsHeader