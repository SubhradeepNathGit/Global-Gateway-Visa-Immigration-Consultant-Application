import { CheckCircle, Shield, XCircle } from 'lucide-react'
import React from 'react'

const AdminStats = ({ admins }) => {

  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(a => a.is_blocked === false).length;
  const blockedAdmins = admins.filter(a => a.is_blocked === true).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-slate-400 mb-1">Total Admins</p>
            <p className="text-2xl sm:text-3xl font-bold text-white">{totalAdmins}</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-slate-400 mb-1">Active Admins</p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400">{activeAdmins}</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-slate-400 mb-1">Blocked Admins</p>
            <p className="text-2xl sm:text-3xl font-bold text-red-400">{blockedAdmins}</p>
          </div>
          <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
            <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminStats