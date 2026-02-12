import React from 'react'
import { useDispatch } from 'react-redux';
import { fetchNotifications, markNotificationRead } from '../../../Redux/Slice/notificationSlice';
import hotToast from '../../../util/alert/hot-toast';
import getSweetAlert from '../../../util/alert/sweetAlert';
import { Check } from 'lucide-react';

const AdminNotificationHeader = ({unreadCount}) => {
    const dispatch = useDispatch();

    // Mark all as read
    const markAllAsRead = () => {
        dispatch(markNotificationRead({
            id: null,
            receiver_type: 'admin',
            receiver_id: null
        }))
            .then(() => {
                dispatch(fetchNotifications({ receiver_type: 'admin', receiver_country_id: null }));
                hotToast('All notifications marked as read', 'success');
            })
            .catch(() => {
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Notifications</h1>
                <p className="text-slate-400 text-sm mt-1">
                    {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                </p>
            </div>

            {unreadCount > 0 && (
                <button
                    onClick={markAllAsRead}
                    className="self-start sm:self-auto px-4 py-2.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 transition-all text-sm font-medium flex items-center gap-2 border border-blue-500/30"
                >
                    <Check size={16} />
                    <span>Mark all as read</span>
                </button>
            )}
        </div>
    )
}

export default AdminNotificationHeader