import React from 'react'
import { CheckCircle, Clock, XCircle } from 'lucide-react';

const TransactionStatusBadge = ({status}) => {
    const styles = {
        success: "bg-green-500/20 text-green-400 border-green-500/30",
        pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        failed: "bg-red-500/20 text-red-400 border-red-500/30 px-4",
    };

    const icons = {
        success: CheckCircle,
        pending: Clock,
        failed: XCircle,
    };

    const statusKey = status?.toLowerCase() || "pending";
    const Icon = icons[statusKey];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[statusKey]}`}>
            {Icon && <Icon className="w-3 h-3" />}
            {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
        </span>
    );
}

export default TransactionStatusBadge