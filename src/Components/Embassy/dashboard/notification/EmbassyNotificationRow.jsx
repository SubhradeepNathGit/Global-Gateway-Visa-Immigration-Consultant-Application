import React from 'react'
import { Check, Clock, AlertCircle, Info, CheckCircle, XCircle } from "lucide-react";
import { fetchNotifications, markNotificationRead } from '../../../../Redux/Slice/notificationSlice';
import { useDispatch } from 'react-redux';
import getSweetAlert from '../../../../util/alert/sweetAlert';

const EmbassyNotificationRow = ({ notification, country_id, selectedNotifications, setSelectedNotifications }) => {
    const dispatch = useDispatch();

    // Handle select notification
    const handleSelectNotification = (id) => {
        setSelectedNotifications(prev =>
            prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
        );
    }

    // Get icon based on notification type
    const getNotificationIcon = (type) => {
        switch (type) {
            case "success":
                return <CheckCircle className="text-green-600" size={20} />;
            case "error":
                return <XCircle className="text-red-600" size={20} />;
            case "warning":
                return <AlertCircle className="text-yellow-600" size={20} />;
            case "info":
            default:
                return <Info className="text-blue-600" size={20} />;
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

    // Handle notification click
    const handleNotificationClick = (notification) => {
        if (!notification?.mark_read) {
            dispatch(markNotificationRead({
                id: notification.id,
                receiver_type: 'embassy',
                receiver_id: country_id
            }))
                .then(res => {
                    // console.log('Response for mark specific notification read', res);

                    dispatch(fetchNotifications({
                        receiver_type: 'embassy',
                        receiver_country_id: country_id
                    }));
                })
                .catch(() => {
                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                });
        }
    }

    return (
        <div
            className={`group relative bg-white border rounded-lg hover:bg-gray-50 transition-all ${!notification.mark_read ? "bg-blue-50 border-blue-200" : "border-gray-200"}`}
        >
            <div className="flex items-start gap-3 sm:gap-4 p-4">
                {/* Checkbox */}
                <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => handleSelectNotification(notification.id)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                />

                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => handleNotificationClick(notification)}
                >
                    <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="text-gray-900 font-medium text-sm sm:text-base">
                            {notification.title}
                            {notification?.application_id && (
                                <span className="text-gray-500 ml-1">
                                    {notification.application_id.slice(0, 16) + '######'}
                                </span>
                            )}
                        </h3>
                        {!notification.mark_read && (
                            <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                        )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {notification.message}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock size={12} />
                            <span>{formatDate(notification.created_at)}</span>
                        </div>

                        {/* Mark as Read Button - Shows only for unread notifications */}
                        {!notification.mark_read && (
                            <button
                                onClick={() => handleNotificationClick(notification)}
                                className="px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 rounded flex items-center gap-1 transition-all border border-blue-200"
                            >
                                <Check size={12} />
                                <span>Mark read</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default EmbassyNotificationRow