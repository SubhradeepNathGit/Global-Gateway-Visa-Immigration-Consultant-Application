import { Download } from 'lucide-react'
import React from 'react'

const TransactionHeader = () => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Payments</h1>
                <p className="text-slate-400">Manage and track all payment transactions</p>
            </div>
           
        </div>
    )
}

export default TransactionHeader