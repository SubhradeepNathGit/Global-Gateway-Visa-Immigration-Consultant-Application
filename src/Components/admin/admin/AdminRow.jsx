import React from 'react'
import { Ban, Calendar, CheckCircle, CircleAlert, CircleCheck, Mail, Phone, Trash2, XCircle } from 'lucide-react'

const AdminRow = ({ admin, index, filteredAdmins, handleUnblockBlockAdmin }) => {
    // console.log('Current admin details',admin);

    const Icon = !admin.is_blocked ? Ban : CircleCheck;
    return (
        <tr className={`border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors ${index === filteredAdmins.length - 1 ? 'border-b-0' : ''
            }`}
        >
            <td className="p-4">
                <div className="text-sm font-medium text-white">{admin?.name ? admin?.name : 'N/A'}</div>
            </td>
            <td className="p-4">
                <div className="text-sm text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {admin?.email ? admin?.email : 'N/A'}
                </div>
            </td>
            <td className="p-4">
                <div className="text-sm text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {admin?.phone ? admin?.phone : 'N/A'}
                </div>
            </td>
            <td className="p-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${admin?.is_verified === "pending"
                    ? "text-orange-400 bg-orange-500/20 border-orange-500/30" : admin?.is_verified === "success"
                        ? "text-emerald-400 bg-emerald-500/20 border-emerald-500/30 px-3"
                        : "text-red-400 bg-red-500/20 border-red-500/30"
                    }`}>
                    {admin?.is_verified === "pending" ? (
                        <CircleAlert className="w-3 h-3" />
                    ) : admin?.is_verified === "success" ? (
                        <CheckCircle className="w-3 h-3" />
                    ) : (
                        <XCircle className="w-3 h-3" />
                    )}
                    {admin?.is_verified === "pending" ? "Pending" : admin?.is_verified === "success" ? "success" : "Failed"}
                </span>
            </td>
            <td className="p-4">
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
            </td>
            <td className="p-4">
                <div className="text-sm text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {admin?.updated_at ? new Date(admin?.created_at)?.toLocaleDateString("en-GB") : "N/A"}
                </div>
            </td>
            <td className="p-4">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => handleUnblockBlockAdmin(admin?.id, admin?.is_blocked)}
                        className={`p-2 rounded-lg border transition-all ${admin.is_blocked
                            ? "bg-green-600/20 hover:bg-green-600/30 border-green-500/30 text-green-400"
                            : "bg-red-600/20 hover:bg-red-600/30 border-red-500/30 text-red-400"} ${admin.is_verified === "pending" ? 'cursor-not-allowed bg-red-600/50 hover:bg-red-600/50 text-red-500' : 'cursor-pointer'}`}
                        title={!admin.is_blocked ? "Block access" : "Restore access"} disabled={admin.is_verified === "pending"}>
                        <Icon className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default AdminRow;
