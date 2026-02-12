import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Settings, ChevronDown, Moon, Sun, X } from "lucide-react";
import { useSidebarStore } from "../../../util/useSidebarStore";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../Redux/Slice/auth/checkAuthSlice";
import { fetchNotifications, markNotificationRead } from "../../../Redux/Slice/notificationSlice";
import getSweetAlert from "../../../util/alert/sweetAlert";
import { formatDateDDMMYYYYHHMM } from "../../../util/dateFormat/dateFormatConvertion";
import { encodeBase64Url } from "../../../util/encodeDecode/base64";

export default function EmbassyNavbar({ embassyData, countryDetails }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const collapsed = useSidebarStore((s) => s.collapsed);

    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const notificationRef = useRef(null);
    const userMenuRef = useRef(null);
    const { isNotificationLoading, notificationList, hasNotificationError } = useSelector(state => state?.notification);

    // console.log('Embassy details', embassyData);
    // console.log('Country details', countryDetails);
    // console.log('Notification List',notificationList);

    // notification 
    useEffect(() => {
        if (!embassyData?.country_id) return;

        dispatch(fetchNotifications({ receiver_type: 'embassy', receiver_country_id: embassyData?.country_id }))
            .then(res => {
                // console.log('Response for fetching notification', res)
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert("Oops...", "Something went wrong!", "error");
            })
    }, [dispatch, embassyData?.country_id]);

    // Detect screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await dispatch(logoutUser({ user_type: 'embassy', showAlert: true }));
        navigate('/embassy/');
    };

    const toggleTheme = useCallback(() => {
        setIsDarkMode((prev) => !prev);
        document.documentElement.classList.toggle("dark");
    }, []);

    const markAllAsRead = (receiver_type, receiver_id) => {
        dispatch(markNotificationRead({ id: null, receiver_type, receiver_id }))
            .then(res => {
                // console.log('Response for updating data', res);
                setShowNotifications(false);
                dispatch(fetchNotifications({ receiver_type: 'embassy', receiver_country_id: embassyData?.country_id }))
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    };

    return (
        <header
            className={`fixed top-0 right-0 left-0 z-40 transition-all duration-300 bg-white border-b border-gray-200 ${collapsed ? "md:left-20" : "md:left-64"
                }`}
        >
            <div className="flex items-center justify-between px-4 h-16 md:h-18 lg:h-18 md:px-6">
                {/* Left Section - Logo & Title */}
                <div className="flex items-center gap-3 md:gap-4">
                    {/* Title */}
                    <div className="flex items-center gap-2">
                        <div>
                            <h1 className="text-gray-900 text-sm sm:text-base md:text-base font-semibold">
                                Global Gateway
                            </h1>
                            <p className="text-gray-500 text-xs">Embassy Panel</p>
                        </div>
                    </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-2 md:gap-3">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 md:p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                        aria-label="Toggle theme"
                        title="Toggle theme"
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 md:p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                            aria-label="Notifications"
                            title="Notifications"
                        >
                            <Bell size={18} />
                            {notificationList?.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-blue-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                                    {notificationList?.length}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                    <h3 className="text-gray-900 font-semibold text-sm">Notifications</h3>
                                    {notificationList?.length > 0 && (
                                        <button
                                            onClick={() => markAllAsRead('embassy', embassyData?.country_id)}
                                            className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notificationList?.slice(0, 3)?.map((notification) => (
                                        <div
                                            key={notification?.id}
                                            className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${!notification?.mark_read ? "bg-blue-50" : ""
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {!notification?.mark_read && (
                                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-gray-900 text-sm font-medium truncate">
                                                        <>
                                                            {notification?.title}
                                                            {notification?.application_id ? notification?.application_id?.slice(0, 16) + '######' : ''}
                                                        </>
                                                    </p>
                                                    <p className="text-gray-500 text-xs mt-1">
                                                        {formatDateDDMMYYYYHHMM(notification?.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 border-t border-gray-200">
                                    <button
                                        onClick={() => {
                                            navigate(`/embassy/dashboard/notifications/${encodeBase64Url(String(embassyData?.country_id))}`);
                                            setShowNotifications(false);
                                        }}
                                        className="w-full text-center text-sm text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                                    >
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 pr-2 md:pr-3 rounded-lg bg-transparent hover:bg-gray-100 transition-all group"
                            aria-label="User menu"
                        >
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border border-blue-700 overflow-hidden">
                                <img src={countryDetails?.details?.flag_url} alt="E" className="w-full h-full object-cover rounded-full" />
                            </div>

                            <div className="hidden lg:block text-left">
                                <p className="text-gray-900 text-sm font-medium">{countryDetails?.name?.length > 15 ? countryDetails?.name?.slice(0, 16) + '...' : countryDetails?.name}</p>
                                <p className="text-gray-500 text-xs">{embassyData?.email || 'embassy@global.com'}</p>
                            </div>
                            <ChevronDown
                                className={`hidden md:block text-gray-500 transition-transform ${showUserMenu ? "rotate-180" : ""
                                    }`}
                                size={16}
                            />
                        </button>

                        {/* User Dropdown */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                                <div className="p-4 border-b border-gray-200">
                                    <p className="text-gray-900 text-sm font-medium">Global Gateway Embassy</p>
                                    <p className="text-gray-500 text-xs mt-0.5">
                                        {embassyData?.email || 'embassy@global.com'}
                                    </p>
                                </div>

                                {/* <div className="p-2">
                                    <button
                                        onClick={() => {
                                            navigate("/embassy/dashboard/settings");
                                            setShowUserMenu(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-all text-sm"
                                    >
                                        <Settings size={16} />
                                        <span>Settings</span>
                                    </button>
                                </div> */}

                                <div className="p-2 border-t border-gray-200">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all text-sm cursor-pointer"
                                    >
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}