import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell, Check, Filter, Search, AlertCircle, X } from "lucide-react";
import { fetchNotifications, markNotificationRead } from "../../../Redux/Slice/notificationSlice";
import getSweetAlert from "../../../util/alert/sweetAlert";
import EmbassyNotificationRow from "../../../Components/embassy/dashboard/notification/EmbassyNotificationRow";
import { useParams } from "react-router-dom";
import hotToast from "../../../util/alert/hot-toast";
import EmbassyNotificationHeader from "../../../Components/embassy/dashboard/notification/EmbassyNotificationHeader";
import { decodeBase64Url } from "../../../util/encodeDecode/base64";

export default function EmbassyNotifications() {
  const { countryId } = useParams();
  const country_id = decodeBase64Url(countryId);
  
  const dispatch = useDispatch();
  const { isNotificationLoading, notificationList, hasNotificationError } = useSelector(state => state?.notification);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Fetch notifications on mount
  useEffect(() => {
    if (!country_id) return;

    dispatch(fetchNotifications({
      receiver_type: 'embassy',
      receiver_country_id: country_id
    }))
      .then(res => {
        // console.log('Response for fatching all notification', res);
      }).catch(err => {
        console.log('Error occured', err);
        getSweetAlert("Oops...", "Something went wrong!", "error");
      })
  }, [dispatch, country_id]);

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
        receiver_type: 'embassy',
        receiver_id: country_id
      }))
    );

    Promise.all(promises)
      .then(() => {
        dispatch(fetchNotifications({
          receiver_type: 'embassy',
          receiver_country_id: country_id
        }));
        setSelectedNotifications([]);
        hotToast('All notifications marked as read', 'success');
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
      {/* Header - Light Theme */}
      <EmbassyNotificationHeader unreadCount={unreadCount} country_id={country_id} />

      {/* Main Content Card - Light Theme */}
      <div className="rounded-xl">
        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="relative filter-dropdown">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="w-full sm:w-auto px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all flex items-center justify-between sm:justify-start gap-2 text-sm text-gray-900"
              >
                <Filter size={16} />
                <span className="capitalize">{filterType}</span>
              </button>

              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-20">
                  {["all", "unread", "read"].map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilterType(type);
                        setShowFilterMenu(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-all text-sm ${filterType === type ? "text-blue-600 bg-blue-50" : "text-gray-700"
                        }`}
                    >
                      <span className="capitalize">{type}</span>
                      {type === "unread" && unreadCount > 0 && (
                        <span className="ml-2 text-xs text-gray-500">({unreadCount})</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedNotifications?.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm text-gray-700">
                {selectedNotifications?.length} selected
              </span>
              <div className="flex gap-2 sm:ml-auto">
                <button
                  onClick={markSelectedAsRead}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-sm flex items-center justify-center gap-2 transition-all text-gray-700 cursor-pointer"
                >
                  <Check size={14} />
                  <span>Mark as read</span>
                </button>
                {/* <button
                  onClick={deleteSelected}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm flex items-center justify-center gap-2 transition-all border border-red-200">
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : hasNotificationError ? (
          <div className="text-center py-20">
            <AlertCircle className="mx-auto text-red-600 mb-4" size={48} />
            <p className="text-gray-600">Failed to load notifications</p>
            <button
              onClick={() => dispatch(fetchNotifications({
                receiver_type: 'embassy',
                receiver_country_id: country_id
              }))}
              className="mt-4 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all text-sm"
            >
              Try Again
            </button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-600 text-lg mb-2">
              {searchQuery || filterType !== "all" ? "No notifications found" : "No notifications yet"}
            </p>
            {(searchQuery || filterType !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterType("all");
                }}
                className="mt-4 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {/* Select All */}
            {filteredNotifications.length > 0 && (
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg mb-4">
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === filteredNotifications.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-600">
                  {selectedNotifications.length === filteredNotifications.length ? "Deselect all" : "Select all"}
                </span>
              </div>
            )}

            {/* Notification Items */}
            {filteredNotifications.map(notification => (
              <EmbassyNotificationRow key={notification.id} notification={notification} country_id={country_id} selectedNotifications={selectedNotifications} setSelectedNotifications={setSelectedNotifications} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}