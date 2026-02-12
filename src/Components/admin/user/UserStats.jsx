import React from 'react'
import { User, FileText, CheckCircle } from "lucide-react";

const UserStats = ({ totalUsers, activeUsers, totalRevenue }) => {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-2">
                        <User className="w-5 h-5 text-blue-400" />
                        <span className="text-sm text-slate-400">Total Users</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{totalUsers}</div>
                </div>
                <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-sm text-slate-400">Active Users</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{activeUsers}</div>
                </div>
                <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-cyan-400" />
                        <span className="text-sm text-slate-400">Total Revenue</span>
                    </div>
                    <div className="text-2xl font-bold text-white">₹{totalRevenue?.toLocaleString('en-IN')}</div>
                </div>
            </div>
        </>
    )
}

export default UserStats