import { Loader2 } from 'lucide-react';
import React from 'react'

const DashboardStatCard = ({ title, value, delta, isLoading, children }) => {
    return (
        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-all">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <div>
                    <div className="text-xs sm:text-sm text-slate-400 mb-1">{title}</div>
                    <div className="text-2xl sm:text-3xl font-semibold text-white">{value}</div>
                </div>

                {/* Loader OR delta text */}
                {isLoading ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                    <div className={`text-sm sm:text-base font-medium ${delta?.startsWith('+') ? 'text-green-400' : delta?.startsWith('-') ? 'text-red-400' : 'text-slate-300'}`}>
                        {delta}
                    </div>
                )}
            </div>

            <div className="h-48 sm:h-56 lg:h-64">{children}</div>
        </div>
    );
}

export default DashboardStatCard