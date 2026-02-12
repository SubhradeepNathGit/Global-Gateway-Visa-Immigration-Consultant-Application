"use client";

import { useAverageProcessingTimes } from "../../../tanstack/query/getAverageProcessingTimes";

export default function AverageProcessingTime() {
    const { data, isLoading } = useAverageProcessingTimes();

    if (isLoading)
        return (
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <p className="text-slate-400">Loading...</p>
            </div>
        );

    if (!data?.length)
        return (
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <p className="text-slate-400">No visa data available</p>
            </div>
        );

    const maxDays = Math.max(...data.map(item => item.avg_days));

    return (
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-sm sm:text-base font-medium text-slate-300 mb-3 sm:mb-4">
                Average Processing Times
            </div>

            <div className="glass-scrollbar space-y-3 max-h-42 overflow-y-auto">
                {data.map(item => (
                    <div key={item.visa_type}>
                        <div className="flex justify-between text-xs sm:text-sm mb-1 mr-1">
                            <span className="text-slate-400">{item.visa_type}</span>
                            <span className="text-white font-medium">{item.avg_days} days</span>
                        </div>

                        <div className="w-full bg-slate-700/30 rounded-full h-2">
                            <div
                                className="bg-cyan-500 h-2 rounded-full"
                                style={{
                                    width: `${(item.avg_days / maxDays) * 100}%`,
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
