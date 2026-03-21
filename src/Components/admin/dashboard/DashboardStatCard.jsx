import React from 'react'
import Skeleton from '../../Skeleton';

const DashboardStatCard = ({ title, value, delta, isLoading, children }) => {
    return (
        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-all">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <div>
                    <div className="text-xs sm:text-sm text-slate-400 mb-1">{title}</div>
                    <div className="text-2xl sm:text-3xl font-semibold text-white">
                        {isLoading ? <Skeleton isDark className="h-9 w-32" /> : value}
                    </div>
                </div>

                {/* Skeleton OR delta text */}
                {isLoading ? (
                    <Skeleton isDark className="h-6 w-20" />
                ) : (
                    <div className={`text-sm sm:text-base font-medium ${delta?.startsWith('+') ? 'text-green-400' : delta?.startsWith('-') ? 'text-red-400' : 'text-slate-300'}`}>
                        {delta}
                    </div>
                )}
            </div>

            <div className="h-48 sm:h-56 lg:h-64">
                {isLoading ? <Skeleton isDark className="h-full w-full opacity-20" /> : children}
            </div>
        </div>
    );
}

export default DashboardStatCard