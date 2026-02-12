import React from 'react'
import { Ban, Calendar, CheckCircle, CircleCheck, Mail, Phone, XCircle } from 'lucide-react'

const AdminCard = ({ admin, handleUnblockBlockAdmin }) => {
    const Icon = !admin.is_blocked ? Ban : CircleCheck;

    return (
        <div className="p-4 hover:bg-slate-700/20 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white mb-2">{admin?.name ? admin?.name : 'N/A'}</h3>
                    <div className="space-y-1.5">
                        <div className="text-xs text-slate-400 flex items-center gap-1.5">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate"> {admin?.email ? admin?.email : 'N/A'}</span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5">
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            <span>{admin?.phone ? admin?.phone : 'N/A'}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${!admin?.is_blocked
                            ? "text-emerald-400 bg-emerald-500/20 border-emerald-500/30 px-3"
                            : "text-red-400 bg-red-500/20 border-red-500/30"
                            }`}>
                            {admin?.is_blocked === false ? (
                                <CheckCircle className="w-3 h-3" />
                            ) : (
                                <XCircle className="w-3 h-3" />
                            )}
                            {!admin?.is_blocked ? "Active" : "Blocked"}
                        </span>
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {admin?.updated_at ? new Date(admin?.created_at)?.toLocaleDateString("en-GB") : "N/A"}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleUnblockBlockAdmin(admin?.id, admin?.is_blocked)}
                        className={`p-2 rounded-lg border transition-all ${admin.is_blocked
                            ? "bg-green-600/20 hover:bg-green-600/30 border-green-500/30 text-green-400"
                            : "bg-red-600/20 hover:bg-red-600/30 border-red-500/30 text-red-400"} ${admin.is_verified === "pending" ? 'cursor-not-allowed bg-red-600/50 hover:bg-red-600/50 text-red-500' : 'cursor-pointer'}`}
                        title={!admin.is_blocked ? "Block access" : "Restore access"} disabled={admin.is_verified === "pending"}>
                        <Icon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminCard