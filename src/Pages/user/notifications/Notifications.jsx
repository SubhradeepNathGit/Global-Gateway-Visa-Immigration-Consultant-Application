import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle, 
  GraduationCap, 
  CreditCard, 
  Info, 
  Plane, 
  X, 
  Filter,
  Check,
  Trash2,
  ChevronLeft,
  Settings,
  MoreVertical,
  FileText
} from 'lucide-react';

// Custom time formatting function
const formatDistanceToNow = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 604800)}w ago`;
};

// Static notification data
const staticNotifications = [
  {
    id: 1,
    type: 'application',
    title: 'Visa Application Approved',
    message: 'Your visa application for Canada has been approved. Please check your dashboard for details.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
    icon: CheckCircle,
    color: 'blue',
    actionUrl: '/dashboard'
  },
  {
    id: 2,
    type: 'application',
    title: 'Application Under Review',
    message: 'Your visa application for United Kingdom is currently under review by the embassy.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    isRead: false,
    icon: FileText,
    color: 'blue',
    actionUrl: '/dashboard'
  },
  {
    id: 3,
    type: 'course',
    title: 'New Course Enrolled',
    message: 'You have successfully enrolled in "IELTS Preparation Course". Start learning now!',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isRead: false,
    icon: GraduationCap,
    color: 'green',
    actionUrl: '/course'
  },
  {
    id: 4,
    type: 'payment',
    title: 'Payment Successful',
    message: 'Your payment of $150 for visa application has been processed successfully.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isRead: true,
    icon: CreditCard,
    color: 'purple',
    actionUrl: '/dashboard'
  },
  {
    id: 5,
    type: 'system',
    title: 'New Feature Available',
    message: 'Check out our new course recommendation system to find courses that match your goals.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isRead: true,
    icon: Info,
    color: 'orange',
    actionUrl: '/course'
  },
  {
    id: 6,
    type: 'application',
    title: 'Document Required',
    message: 'Additional documents are required for your Australia visa application. Please upload them.',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    isRead: true,
    icon: Plane,
    color: 'red',
    actionUrl: '/dashboard'
  },
  {
    id: 7,
    type: 'course',
    title: 'Course Completed',
    message: 'Congratulations! You have completed "English Speaking Course". Download your certificate.',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isRead: true,
    icon: GraduationCap,
    color: 'green',
    actionUrl: '/dashboard'
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(staticNotifications);
  const [filter, setFilter] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Delete notification
  const deleteNotification = (id, e) => {
    e?.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div className="flex items-center gap-2 sm:gap-3">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Mark all read
                </button>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${showFilterMenu ? 'bg-gray-100' : ''}`}
                >
                  <Filter className="w-5 h-5 text-gray-700" />
                </button>

                {showFilterMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowFilterMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                      {[
                        { value: 'all', label: 'All Notifications', icon: Bell },
                        { value: 'unread', label: 'Unread', icon: Bell },
                        { value: 'application', label: 'Applications', icon: FileText },
                        { value: 'course', label: 'Courses', icon: GraduationCap },
                        { value: 'payment', label: 'Payments', icon: CreditCard },
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
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                              filter === option.value ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                            }`}
                          >
                            <OptionIcon className="w-4 h-4" />
                            {option.label}
                            {filter === option.value && (
                              <Check className="w-4 h-4 ml-auto" />
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

          {/* Filter Pills - Mobile */}
          <div className="sm:hidden overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              {[
                { value: 'all', label: 'All' },
                { value: 'unread', label: 'Unread' },
                { value: 'application', label: 'Applications' },
                { value: 'course', label: 'Courses' },
                { value: 'payment', label: 'Payments' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    filter === option.value
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-sm sm:text-base text-gray-500">
              {filter !== 'all'
                ? `No ${filter} notifications found`
                : "You're all caught up!"}
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredNotifications.map((notification, index) => {
              const IconComponent = notification.icon;
              const isHovered = hoveredId === notification.id;
              
              return (
                <div
                  key={notification.id}
                  className={`bg-white border-b border-gray-100 transition-all cursor-pointer group ${
                    !notification.isRead ? 'bg-blue-50/30' : ''
                  } hover:bg-gray-50 ${index === 0 ? 'rounded-t-xl' : ''} ${
                    index === filteredNotifications.length - 1 ? 'rounded-b-xl border-b-0' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                  onMouseEnter={() => setHoveredId(notification.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${getIconStyle(notification.color)}`}>
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-1">
                              <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex-1">
                                {notification.title}
                              </h3>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed mb-2">
                              {notification.message}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 font-medium">
                              {formatDistanceToNow(notification.timestamp)}
                            </p>
                          </div>

                          {/* Delete button */}
                          <button
                            onClick={(e) => deleteNotification(notification.id, e)}
                            className={`flex-shrink-0 p-2 hover:bg-red-50 rounded-lg transition-all ${
                              isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-0'
                            } group-hover:opacity-100`}
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile FAB for Mark All Read */}
      {unreadCount > 0 && (
        <button
          onClick={markAllAsRead}
          className="sm:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-20"
        >
          <Check className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Notifications;