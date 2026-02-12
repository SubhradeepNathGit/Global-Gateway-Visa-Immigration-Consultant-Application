import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell, Check, Filter, Search, AlertCircle, X } from "lucide-react";
import { fetchNotifications, markNotificationRead } from "../../Redux/Slice/notificationSlice";
import getSweetAlert from "../../util/alert/sweetAlert";
import hotToast from "../../util/alert/hot-toast";
import AdminNotificationHeader from "../../Components/admin/notification/AdminNotificationHeader";
import AdminNotificationRow from "../../Components/admin/notification/AdminNotificationRow";

export default function AdminNotifications() {
  const dispatch = useDispatch();
  const { isNotificationLoading, notificationList, hasNotificationError } = useSelector(state => state?.notification);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Fetch notifications on mount
  useEffect(() => {
    dispatch(fetchNotifications({ receiver_type: 'admin', receiver_country_id: null }))
      .then(res => {
        // console.log('Response for fetching all notifications', res)
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert("Oops...", "Something went wrong!", "error");
      });
  }, [dispatch]);

  // Filter notifications
  const filteredNotifications = (notificationList || []).filter(notification => {
    const matchesSearch = notification?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification?.message?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" ||
      (filterType === "unread" && !notification?.mark_read) ||
      (filterType === "read" && notification?.mark_read);
    return matchesSearch && matchesFilter;
  });

  const unreadCount = (notificationList || []).filter(n => !n?.mark_read).length;

  // Handle select notification
  const handleSelectNotification = (id) => {
    setSelectedNotifications(prev =>
      prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  // Mark selected as read
  const markSelectedAsRead = () => {
    const promises = selectedNotifications.map(id =>
      dispatch(markNotificationRead({
        id,
        receiver_type: 'admin',
        receiver_id: null
      }))
    );

    Promise.all(promises)
      .then(() => {
        dispatch(fetchNotifications({ receiver_type: 'admin', receiver_country_id: null }));
        setSelectedNotifications([]);
        hotToast('Notifications marked as read', 'success');
      })
      .catch(() => {
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      });
  };


  // Close filter menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showFilterMenu && !e.target.closest('.filter-dropdown')) {
        setShowFilterMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilterMenu]);

  return (
    <div className="w-full space-y-6">
      {/* Header - Matching Settings Style */}
      <AdminNotificationHeader unreadCount={unreadCount} />

      {/* Main Content Card - Matching Settings Card Style */}
      <div className="rounded-xl">
        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="relative filter-dropdown">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg hover:bg-slate-700/50 transition-all flex items-center justify-between sm:justify-start gap-2 text-sm text-white"
              >
                <Filter size={16} />
                <span className="capitalize">{filterType}</span>
              </button>

              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-20">
                  {["all", "unread", "read"].map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilterType(type);
                        setShowFilterMenu(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left hover:bg-slate-700/50 transition-all text-sm ${filterType === type ? "text-blue-400 bg-blue-500/10" : "text-slate-300"
                        }`}
                    >
                      <span className="capitalize">{type}</span>
                      {type === "unread" && unreadCount > 0 && (
                        <span className="ml-2 text-xs text-slate-500">({unreadCount})</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <span className="text-sm text-slate-300">
                {selectedNotifications.length} selected
              </span>
              <div className="flex gap-2 sm:ml-auto">
                <button
                  onClick={markSelectedAsRead}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm flex items-center justify-center gap-2 transition-all text-white"
                >
                  <Check size={14} />
                  <span>Mark as read</span>
                </button>
                {/* <button
                  onClick={deleteSelected}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button> */}
              </div>
            </div>
          )}
        </div>

        {/* Notifications List */}
        {isNotificationLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : hasNotificationError ? (
          <div className="text-center py-20">
            <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
            <p className="text-slate-400">Failed to load notifications</p>
            <button
              onClick={() => dispatch(fetchNotifications({ receiver_type: 'admin', receiver_country_id: null }))}
              className="mt-4 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all text-sm"
            >
              Try Again
            </button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="mx-auto text-slate-600 mb-4" size={48} />
            <p className="text-slate-400 text-lg mb-2">
              {searchQuery || filterType !== "all" ? "No notifications found" : "No notifications yet"}
            </p>
            {(searchQuery || filterType !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterType("all");
                }}
                className="mt-4 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {/* Select All */}
            {filteredNotifications.length > 0 && (
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-700/30 rounded-lg mb-4">
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === filteredNotifications.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-blue-500 focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                />
                <span className="text-sm text-slate-400">
                  {selectedNotifications.length === filteredNotifications.length
                    ? "Deselect all"
                    : "Select all"}
                </span>
              </div>
            )}

            {/* Notification Items */}
            {filteredNotifications.map(notification => (
              <AdminNotificationRow key={notification.id} notification={notification} selectedNotifications={selectedNotifications} handleSelectNotification={handleSelectNotification} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}