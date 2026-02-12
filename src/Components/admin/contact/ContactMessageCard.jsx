import React from 'react'
import { Calendar, Clock } from "lucide-react";
import ContactStatusBadge from './ContactStatusBadge';

const MessageCard = ({ message, onView }) => {
    return (
        <div className="p-4 border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors cursor-pointer"
            onClick={() => onView(message)}>

            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 font-semibold text-sm">
                            {message?.name?.split(' ')?.map(n => n[0])?.join('')?.toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white mb-1 truncate">{message?.name}</div>
                        <div className="text-xs text-slate-400 truncate">{message?.email}</div>
                    </div>
                </div>
                <ContactStatusBadge status={message?.status} />
            </div>

            <p className="text-sm text-slate-300 mb-3 line-clamp-2">{message?.message}</p>

            <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-3 h-3" />
                <span>{message?.created_at ? new Date(message?.created_at).toLocaleDateString("en-GB") : "N/A"}</span>
                <span className="mx-1">•</span>
                <Clock className="w-3 h-3" />
                <span>{message?.created_at
                    ? new Date(message.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    })
                    : "N/A"}</span>
            </div>
        </div>
    )
}

export default MessageCard