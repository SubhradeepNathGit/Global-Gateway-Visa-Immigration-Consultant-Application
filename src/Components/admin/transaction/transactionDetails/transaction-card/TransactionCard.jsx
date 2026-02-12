import React from 'react'
import { CreditCard, MoreVertical } from 'lucide-react'
import TransactionStatusBadge from '../TransactionStatusBadge'

const TransactionCard = ({txn}) => {
    return (
        <div className="p-4 hover:bg-slate-700/20 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="text-sm font-medium text-white mb-1">{txn?.transaction_id}</div>
                    <div className="text-xs text-slate-400 mb-2">{txn?.application_id}</div>
                    <div className="text-sm text-white font-medium mb-1">{txn?.user?.name}</div>
                    <div className="text-xs text-slate-400">{txn.visaType}</div>
                </div>
                <button className="p-1 hover:bg-slate-700/50 rounded transition-colors">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                </button>
            </div>

            <div className="flex items-center justify-between mb-3">
                <div className="text-xl font-bold text-white">
                   ₹{txn?.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <TransactionStatusBadge status={txn?.status} />
            </div>

            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                    <CreditCard className="w-3 h-3 text-slate-400" />
                    {txn?.transaction_details?.payment_method?.toUpperCase()}
                </div>
                <div className="text-slate-400">{txn?.created_at ? new Date(txn?.created_at).toLocaleDateString("en-GB") : "N/A"}</div>
            </div>
        </div>
    )
}

export default TransactionCard