import React from 'react'
import { CheckCircle, Mail, MessageSquare } from 'lucide-react'

const ContactStats = ({stats}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 sm:p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                        <MessageSquare className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-sm text-slate-400">Total Messages</span>
                </div>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="p-5 sm:p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
                        <Mail className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="text-sm text-slate-400">New Messages</span>
                </div>
                <div className="text-2xl font-bold text-white">{stats.new}</div>
            </div>
            <div className="p-5 sm:p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-sm text-slate-400">Replied</span>
                </div>
                <div className="text-2xl font-bold text-white">{stats.replied}</div>
            </div>
        </div>
    )
}

export default ContactStats