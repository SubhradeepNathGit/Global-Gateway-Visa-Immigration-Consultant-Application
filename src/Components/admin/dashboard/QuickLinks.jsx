import React from 'react'
import { FilePlus, Download, Bell } from "lucide-react";
import { Link } from 'react-router-dom';

const QuickLinks = () => {
    return (
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-sm sm:text-base font-medium text-slate-300 mb-3 sm:mb-4">
                Quick Actions
            </div>
            <div className="flex flex-col gap-2 sm:gap-3">
                <Link to='/admin/dashboard/contact' className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 text-white text-sm sm:text-base transition-all active:scale-95 font-medium flex items-center justify-center gap-2">
                    <FilePlus className="w-4 h-4" />
                    New Queries
                </Link>
                <button className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 text-white text-sm sm:text-base transition-all active:scale-95 flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Report
                </button>
                <Link to='/admin/dashboard/adminNotification' className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-slate-400/30 hover:bg-slate-300/50 text-white text-sm sm:text-base transition-all active:scale-95 flex items-center justify-center gap-2">
                    <Bell className="w-4 h-4" />
                    View Alerts
                </Link>
            </div>
        </div>
    )
}

export default QuickLinks