import React from 'react'
import { TrendingUp, TrendingDown } from "lucide-react";

const StatsCard = ({ stat }) => {
    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                            <stat.icon size={22} className={stat.iconColor} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium mb-2">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                            {stat.trend === "down" ? (
                                <TrendingDown size={16} className="text-red-600" />

                            ) : (
                                <TrendingUp size={16} className={`${stat.trend === "up" ? "text-green-600" : "text-orange-400"}`} />
                            )}
                            <span className={`text-sm font-semibold ${stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : "text-orange-400"}`}>
                                {stat.change}
                            </span>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{stat.subtext}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatsCard