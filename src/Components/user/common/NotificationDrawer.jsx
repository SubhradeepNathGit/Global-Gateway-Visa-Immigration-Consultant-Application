import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, GraduationCap, CreditCard, X, Filter, Check, Settings, FileText, CheckCheck, FileVideoCamera, ClipboardClock } from 'lucide-react';
import { resolveNotificationMeta } from '../../../util/notification/notificationResolver';
import { useDispatch } from 'react-redux';
import { fetchNotifications, markNotificationRead } from '../../../Redux/Slice/notificationSlice';
import getSweetAlert from '../../../util/alert/sweetAlert';

// Custom time formatting function
const formatDistanceToNow = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
}

const NotificationDrawer = ({ notificationList, userAuthData, isOpen, onClose }) => {
    const [filter, setFilter] = useState('all');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [hoveredId, setHoveredId] = useState(null);
    const dispatch = useDispatch();

    // Filter notifications
    const filteredNotifications = notificationList?.filter(notification => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !notification?.mark_read;
        return notification?.title?.toLowerCase()?.includes(filter);
    });

    const unreadCount = notificationList.filter(n => !n.mark_read).length;

    // Mark notification as read
    const markAsRead = (notification) => {
        dispatch(markNotificationRead({ id: notification?.id, receiver_type: 'user' }))
            .then(res => {
                // console.log("Response for mark as read notification", res);

                if (res?.meta?.requestStatus == "fulfilled") {
                    dispatch(fetchNotifications({ receiver_type: 'user', user_id: userAuthData?.id }))
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
    };

    // Mark all as read
    const markAllAsRead = () => {
        dispatch(markNotificationRead({ id: null, user_id: userAuthData?.id, receiver_type: 'user' }))
            .then(res => {
                // console.log("Response for mark as read notification", res);

                if (res?.meta?.requestStatus == "fulfilled") {
                    dispatch(fetchNotifications({ receiver_type: 'user', user_id: userAuthData?.id }))
                    onClose();
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
    };

    // Get icon styling
    const getIconStyle = (color) => {
        const styles = {
            blue: 'bg-blue-500/10 text-blue-600',
            green: 'bg-green-500/10 text-green-600',
            purple: 'bg-purple-500/10 text-purple-600',
            orange: 'bg-orange-500/10 text-orange-600',
            red: 'bg-red-500/10 text-red-600',
        };
        return styles[color] || styles.blue;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col border-l border-white/20"
                        style={{
                            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95))',
                        }}
                    >
                        {/* Header */}
                        <div className="flex-shrink-0 px-6 py-5 border-b border-gray-200/50 backdrop-blur-sm bg-white/40">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-xl">
                                        <Bell className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                                        {unreadCount > 0 && (
                                            <p className="text-xs text-gray-500">{unreadCount} unread</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={() => markAllAsRead()}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                        Mark all read
                                    </button>
                                )}

                                <div className="relative ml-auto">
                                    <button
                                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                                        className={`p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer ${showFilterMenu ? 'bg-gray-100' : ''}`}
                                    >
                                        <Filter className="w-4 h-4 text-gray-600" />
                                    </button>

                                    {showFilterMenu && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setShowFilterMenu(false)}
                                            />
                                            <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 z-20 overflow-hidden">
                                                {[
                                                    { value: 'all', label: 'All', icon: Bell },
                                                    { value: 'unread', label: 'Unread', icon: Bell },
                                                    { value: 'application', label: 'Applications', icon: FileText },
                                                    { value: 'course', label: 'Courses', icon: FileVideoCamera },
                                                    { value: 'certificate', label: 'Certificate', icon: GraduationCap },
                                                    { value: 'payment', label: 'Payments', icon: CreditCard },
                                                    { value: 'appointment', label: 'Appointment', icon: ClipboardClock },
                                                    { value: 'system', label: 'System', icon: Settings },
                                                ].map((option) => {
                                                    const OptionIcon = option.icon;
                                                    return (
                                                        <button
                                                            key={option.value}
                                                            onClick={() => {
                                                                setFilter(option.value);
                                                                setShowFilterMenu(false);
                                                            }}
                                                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${filter === option.value ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                                                                }`}
                                                        >
                                                            <OptionIcon className="w-4 h-4" />
                                                            {option.label}
                                                            {filter === option.value && (
                                                                <Check className="w-3.5 h-3.5 ml-auto" />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="flex-1 overflow-y-auto pr-2 custom-notification-scrollbar">
                            {filteredNotifications?.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full px-6 py-12">
                                    <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Bell className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-1">No notifications</h3>
                                    <p className="text-sm text-gray-500 text-center">
                                        {filter !== 'all'
                                            ? `No ${filter} notifications`
                                            : "You're all caught up!"}
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {filteredNotifications?.map(notification => {
                                        // const IconComponent = notification?.icon??'';
                                        const isHovered = hoveredId === notification?.id;
                                        const { title, icon: IconComponent } = resolveNotificationMeta(notification?.title || "");
                                        return (
                                            <motion.div
                                                key={notification?.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={`px-4 py-4 transition-all hover:bg-gray-50/80 ${!notification?.mark_read ? 'bg-blue-50/30' : ''}`}
                                                onMouseEnter={() => setHoveredId(notification?.id)}
                                                onMouseLeave={() => setHoveredId(null)}>

                                                <div className="flex gap-3">
                                                    {/* Icon */}
                                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getIconStyle(notification?.color)}`}>
                                                        <IconComponent className="w-5 h-5" />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2 mb-1">
                                                            <h3 className="text-sm font-semibold text-gray-900 flex-1">
                                                                {title ?? 'N/A'}
                                                            </h3>
                                                            {!notification?.mark_read && (
                                                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5 cursor-pointer" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 leading-relaxed mb-2 line-clamp-2">
                                                            {notification?.title ?? 'N/A'}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-xs text-gray-500 font-medium">
                                                                {formatDistanceToNow(new Date(notification?.created_at))}
                                                            </p>
                                                            <button
                                                                onClick={() => {
                                                                    markAsRead(notification);
                                                                }}
                                                                className={`p-1.5 hover:bg-red-50 text-gray-400 hover:text-blue-600 rounded-lg transition-all cursor-pointer ${isHovered ? "opacity-100" : "opacity-0"
                                                                    }`}
                                                            >
                                                                <CheckCheck className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationDrawer;
