import React from 'react'
import { Check, Clock, AlertCircle, Info, CheckCircle, XCircle } from "lucide-react";
import { useDispatch } from 'react-redux';
import { fetchNotifications, markNotificationRead } from '../../../Redux/Slice/notificationSlice';
import getSweetAlert from '../../../util/alert/sweetAlert';

const AdminNotificationRow = ({ notification, selectedNotifications, handleSelectNotification }) => {
    const dispatch = useDispatch();

    // Handle notification click
    const handleNotificationClick = (notification) => {
        if (!notification?.mark_read) {
            dispatch(markNotificationRead({
                id: notification.id,
                receiver_type: 'admin',
                receiver_id: null
            }))
                .then(() => {
                    dispatch(fetchNotifications({ receiver_type: 'admin', receiver_country_id: null }));
                })
                .catch(() => {
                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                });
        }
    };

    // Format date helper
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    // Get icon based on notification type
    const getNotificationIcon = (type) => {
        switch (type) {
            case "success":
                return <CheckCircle className="text-green-400" size={20} />;
            case "error":
                return <XCircle className="text-red-400" size={20} />;
            case "warning":
                return <AlertCircle className="text-yellow-400" size={20} />;
            case "info":
            default:
                return <Info className="text-blue-400" size={20} />;
        }
    };

    return (
        <div className={`group relative bg-slate-700/30 border border-slate-600/50 rounded-lg hover:bg-slate-700/50 transition-all ${!notification.mark_read ? "bg-blue-500/5 border-blue-500/20" : ""
            }`}
        >
            <div className="flex items-start gap-3 sm:gap-4 p-4">
                {/* Checkbox */}
                <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => handleSelectNotification(notification.id)}
                    className="mt-1 w-4 h-4 rounded bg-slate-700 border-slate-600 text-blue-500 focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                />

                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center mt-0.5">
                    {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => handleNotificationClick(notification)}
                >
                    <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="text-white font-medium text-sm sm:text-base">
                            {notification.title}
                        </h3>
                        {!notification.mark_read && (
                            <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                        )}
                    </div>
                    <p className="text-slate-400 text-sm mb-2 line-clamp-2">
                        {notification.message}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock size={12} />
                            <span>{formatDate(notification.created_at)}</span>
                        </div>

                        {/* Mark as Read Button - Shows only for unread notifications */}
                        {!notification.mark_read && (
                            <button
                                onClick={() => handleNotificationClick(notification)}
                                className="px-2 py-1 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded flex items-center gap-1 transition-all"
                            >
                                <Check size={12} />
                                <span>Mark read</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminNotificationRow