import React from 'react'
import { MessageSquare, Eye, CheckCircle } from "lucide-react";

const ContactStatusBadge = ({ status }) => {
    const config = {
        pending: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30", Icon: MessageSquare },
        rejected: { bg: "bg-slate-500/20", text: "text-slate-400", border: "border-slate-500/30", Icon: Eye },
        replied: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30", Icon: CheckCircle },
    }[status];

    const { Icon } = config;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
            <Icon className="w-3 h-3" />
            {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
        </span>
    );
}

export default ContactStatusBadge