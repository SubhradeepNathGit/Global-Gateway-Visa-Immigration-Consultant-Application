import React from 'react'
import { FileText, Loader2, Lock, Unlock, Users } from 'lucide-react'
import { useApplicationStats } from '../../../tanstack/query/getDashboardStats';

const VisaStats = ({ visaListData }) => {

    const { data: applicationStats, isLoading: isApplicationStatsLoading } = useApplicationStats();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-slate-400 text-xs font-medium">Total Visa Types</h3>
                    <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-white">{visaListData?.length}</p>
                <p className="text-xs text-slate-500 mt-1">System wide</p>
            </div>

            <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-slate-400 text-xs font-medium">Active Visas</h3>
                    <Unlock className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-3xl font-bold text-white">
                    {visaListData?.filter(v => v.status == 'active').length}
                </p>
                <p className="text-xs text-slate-500 mt-1">Currently accepting</p>
            </div>

            <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-slate-400 text-xs font-medium">Not Active Visas</h3>
                    <Lock className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-3xl font-bold text-white">
                    {visaListData?.filter(v => v.status != 'active').length}
                </p>
                <p className="text-xs text-slate-500 mt-1">Currently disabled</p>
            </div>

            <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-slate-400 text-xs font-medium">Total Applications</h3>
                    <Users className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-3xl font-bold text-white">
                    {isApplicationStatsLoading ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : applicationStats?.totalApplications}
                </p>
                <p className="text-xs text-slate-500 mt-1">All time</p>
            </div>
        </div>
    )
}

export default VisaStats