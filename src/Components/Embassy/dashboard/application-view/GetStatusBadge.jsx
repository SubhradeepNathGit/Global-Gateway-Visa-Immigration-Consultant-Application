import React from 'react'
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

const GetStatusBadge = (status) => {
    const statusConfig = {
        pending: {
            bg: "bg-yellow-100",
            text: "text-yellow-700",
            icon: Clock,
            label: "Pending Review"
        },
        approved: {
            bg: "bg-green-100",
            text: "text-green-700",
            icon: CheckCircle,
            label: "Approved"
        },
        rejected: {
            bg: "bg-red-100",
            text: "text-red-700",
            icon: XCircle,
            label: "Rejected"
        },
        processing: {
            bg: "bg-blue-100",
            text: "text-blue-700",
            icon: AlertCircle,
            label: "Under Review"
        }
    };

    const config = statusConfig[status];
    const Icon = config?.icon;

    if (!config) {
        return (
            <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm bg-gray-100 text-gray-600">
                N/A
            </span>
        );
    }

    return (
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${config?.bg} ${config?.text}`}>
            <Icon size={18} />
            {config?.label}
        </span>
    );
};

export default GetStatusBadge;