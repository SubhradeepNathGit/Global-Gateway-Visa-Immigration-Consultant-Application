import { CreditCard } from 'lucide-react'
import React from 'react'
import TransactionStatusBadge from '../TransactionStatusBadge'

const TransactionRow = ({ txn }) => {
    return (
        <tr className="hover:bg-slate-700/20 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{txn?.transaction_id}</span>
                    <span className="text-xs text-slate-400">{txn?.application_id}</span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-white">{txn?.user?.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-300">{txn?.application_id ? 'Visa' : 'Course'}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-300">{txn?.provider}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-white">
                    ₹{txn?.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    {txn?.transaction_details?.payment_method?.toUpperCase()}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <TransactionStatusBadge status={txn?.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-300">{txn?.created_at ? new Date(txn?.created_at).toLocaleDateString("en-GB") : ""}</div>
            </td>
        </tr>
    )
}

export default TransactionRow