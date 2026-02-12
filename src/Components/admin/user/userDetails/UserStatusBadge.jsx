import React from "react";
import { CheckCircle, XCircle, Clock, ShieldCheck, ShieldAlert, ShieldX, ClockAlert } from "lucide-react";

const StatusBadge = ({ status, type }) => {

    const colorMap = {
        success: "bg-green-500/20 text-green-400 border-green-500/30 px-3",
        pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-4",
        processing: "bg-orange-500/20 text-yellow-400 border-yellow-500/30",
        failure: "bg-red-500/20 text-red-400 border-red-500/30 px-4",

        active: "bg-blue-500/20 text-blue-400 border-blue-500/30 px-4",
        blocked: "bg-red-500/20 text-red-400 border-red-500/30",

        approved:"bg-green-500/20 text-green-400 border-green-500/30 px-3",
        rejected:"bg-red-500/20 text-red-400 border-red-500/30 px-4",

        unknown: "bg-slate-500/20 text-slate-400 border-slate-500/30 px-5",
    };

    const iconMap = {
        success: CheckCircle,
        pending: ClockAlert,
        processing: Clock,
        failure: XCircle,

        active: ShieldCheck,
        blocked: ShieldX,

        approved:CheckCircle,
        rejected:XCircle,
        
        unknown: ShieldAlert
    };

    const Icon = iconMap[status] || iconMap["unknown"];
    const styles = colorMap[status] || colorMap["unknown"];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles}`}>
            <Icon className="w-3 h-3" />
            {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
        </span>
    );
};

export default StatusBadge;
