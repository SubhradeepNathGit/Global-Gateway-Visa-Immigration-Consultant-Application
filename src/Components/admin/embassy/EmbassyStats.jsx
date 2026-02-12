import React from 'react'
import { Building2, Clock, ShieldCheck, X } from 'lucide-react';

const EmbassyStats = ({ embassies }) => {

    const stats = {
        total: embassies?.length,
        pending: embassies.filter(e => e?.starting_hours && e?.country_id && e?.is_approved == 'pending').length,
        approved: embassies.filter(e => e?.is_approved === 'fulfilled').length,
        rejected: embassies.filter(e => e?.is_approved === 'rejected').length
    };

    const StatCard = ({ label, value, icon: Icon, color = 'text-white' }) => (
        <div className="bg-slate-700/30 backdrop-blur-sm rounded-lg p-5 h-30 border border-slate-600/50">
            <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">{label}</span>
                <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Embassies" value={stats?.total} icon={Building2} color="text-white" />
            <StatCard label="Pending Review" value={stats?.pending} icon={Clock} color="text-yellow-400" />
            <StatCard label="Approved" value={stats?.approved} icon={ShieldCheck} color="text-green-400" />
            <StatCard label="Rejected" value={stats?.rejected} icon={X} color="text-red-400" />
        </div>
    )
}

export default EmbassyStats