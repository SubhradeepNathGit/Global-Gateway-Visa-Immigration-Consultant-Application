import React from 'react'
import { CheckCheck } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { fetchNotifications, markNotificationRead } from '../../../../Redux/Slice/notificationSlice';
import hotToast from '../../../../util/alert/hot-toast';
import getSweetAlert from '../../../../util/alert/sweetAlert';

const EmbassyNotificationHeader = ({ unreadCount, country_id }) => {
    const dispatch = useDispatch();

    // Mark all as read
    const markAllAsRead = () => {
        dispatch(markNotificationRead({
            id: null,
            receiver_type: 'embassy',
            receiver_id: country_id
        }))
            .then(() => {
                dispatch(fetchNotifications({
                    receiver_type: 'embassy',
                    receiver_country_id: country_id
                }));
                hotToast('All notifications marked as read', 'success');
            })
            .catch(() => {
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 text-sm mt-1">
                    {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                </p>
            </div>

            {unreadCount > 0 && (
                <button
                    onClick={markAllAsRead}
                    className="self-start sm:self-auto px-4 py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all text-sm font-medium flex items-center gap-2 border border-blue-200 cursor-pointer"
                >
                    <CheckCheck size={16} />
                    <span>Mark all as read</span>
                </button>
            )}
        </div>
    )
}

export default EmbassyNotificationHeader