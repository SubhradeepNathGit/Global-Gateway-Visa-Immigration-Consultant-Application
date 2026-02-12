import React, { useState, useEffect, useRef } from "react";
import { Home, Users, CreditCard, Settings, Bell, IdCard, UserCircle, BarChart2, Menu, LogOut, X, ChevronLeft, ChevronRight, User, Landmark, Library, Loader2, UserRoundCog, FileChartColumnIncreasing, Earth, BellRing, MessageSquareText, HandCoins } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSidebarStore } from "../../util/useSidebarStore";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { logoutUser } from "../../Redux/Slice/auth/checkAuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../Redux/Slice/userSlice";
import "../../../src/App.css";
import getSweetAlert from "../../util/alert/sweetAlert";
import { fetchNotifications } from "../../Redux/Slice/notificationSlice";
import { fetchAllContactMessages } from "../../Redux/Slice/contactSlice";

const NavItem = ({ to, icon: Icon, children, collapsed, onClick, badge }) => (

  <NavLink to={to} end onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-3 transition-all duration-200 text-sm font-medium relative group
     ${collapsed ? "justify-center" : ""}
     ${isActive
        ? collapsed
          ? "bg-white/10 text-white shadow-lg rounded-xl"   // square when collapsed
          : "bg-white/10 text-white shadow-lg rounded-lg"   // normal when expanded
        : collapsed
          ? "text-gray-300 hover:bg-white/5 hover:text-white rounded-xl" // square hover
          : "text-gray-300 hover:bg-white/5 hover:text-white rounded-lg" // normal hover
      }`}>

    <div className="flex items-center justify-center w-6 flex-shrink-0">
      <Icon size={18} />
    </div>

    {!collapsed && (
      <>
        <span className="truncate flex-1">{children}</span>
        {badge && (
          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
            {badge}
          </span>
        )}
      </>
    )}
  </NavLink>
);

export default function Sidebar({ adminData }) {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggle = useSidebarStore((s) => s.toggle);
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const dispatch = useDispatch();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { getUserData, isUserLoading } = useSelector(state => state.userProfile);
  const { isNotificationLoading, notificationList, hasNotificationError } = useSelector(state => state?.notification);
  const { contactLoading, contactData, contactError } = useSelector(state => state.contact);

  useEffect(() => {
    dispatch(getAllUsers())
      .then(res => {
        // console.log('Response for fetching logged user',res);
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      });
  }, []);

  // notification 
  useEffect(() => {
    dispatch(fetchNotifications({ receiver_type: 'admin', receiver_country_id: null }))
      .then(res => {
        // console.log('Response for fetching notification for admin', res)
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert("Oops...", "Something went wrong!", "error");
      })
  }, []);

  // message 
  useEffect(() => {
    dispatch(fetchAllContactMessages())
      .then(res => {
        // console.log('Response for fetching message for', res)
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert("Oops...", "Something went wrong!", "error");
      })
  }, []);

  // Close sidebar on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Lock scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await dispatch(logoutUser({ user_type: 'admin', showAlert: true }));
    navigate("/admin/");
  };

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: Home },
    { to: "/admin/dashboard/adminProfile", label: "Profile", icon: UserCircle },

    {
      to: "/admin/dashboard/users", label: "Manage Users", icon: Users,
      badge: isUserLoading ? (<Loader2 className="w-4 h-4 text-white animate-spin" />) : (getUserData?.length),
    },
    { to: "/admin/dashboard/admin", label: "Manage Admin", icon: UserRoundCog },
    { to: "/admin/dashboard/country", label: "Manage Countries", icon: Earth },
    { to: "/admin/dashboard/viewApplications", label: "View Applications", icon: FileChartColumnIncreasing },
    { to: "/admin/dashboard/visaManage", label: "Manage Visa", icon: IdCard },
    { to: "/admin/dashboard/embassyManage", label: "Manage Embassies", icon: Landmark },
    { to: "/admin/dashboard/courseManage", label: "Manage Courses", icon: Library },
    { to: "/admin/dashboard/payments", label: "Payments", icon: CreditCard },
    { to: "/admin/dashboard/charges", label: "Manage Charges", icon: HandCoins },

    {
      to: "/admin/dashboard/payments", label: "Notifications", icon: BellRing,
      badge: isNotificationLoading ? (<Loader2 className="w-4 h-4 text-white animate-spin" />) : (notificationList?.length)
    },
    { to: "/admin/dashboard/analytics", label: "Analytics", icon: BarChart2 },
    {
      to: "/admin/dashboard/contact", label: "Messages", icon: MessageSquareText,
      badge: contactLoading ? (<Loader2 className="w-4 h-4 text-white animate-spin" />) : (contactData?.filter(contact => contact?.status == "pending")?.length)
    },
    { to: "/admin/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300
          bg-gradient-to-b from-black/4 via-transparent to-black backdrop-blur-md
          border-r border-white/5
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{ boxShadow: "inset 0 0 40px rgba(255,255,255,0.02)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          {/* Logo + Title */}
          <div
            className={`flex items-center gap-3 transition-all duration-300 ${collapsed ? "w-14" : "w-48"
              } min-w-0`}
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-white/10 backdrop-blur-sm
      flex items-center justify-center text-white font-bold text-lg shadow-lg 
      border border-white/10">
              <FlightTakeoffIcon fontSize="small" />
            </div>

            {!collapsed && (
              <h1 className="text-white font-semibold text-lg truncate">
                Global Gateway
              </h1>
            )}
          </div>

          {/* Collapse Button */}
          {!collapsed && (
            <button
              onClick={toggle}
              className="hidden md:flex p-2 rounded-lg hover:bg-white/5 
      text-gray-300 hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {/* Mobile Close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 
    text-gray-300 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>


        {/* User profile */}
        {!collapsed && (
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                <User size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">Admin Panel</p>
                <p className="text-gray-400 text-xs truncate">{adminData?.email || 'admin@global.com'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="glass-scrollbar flex-1 p-4 space-y-1 overflow-y-auto">
          {collapsed && (
            <button
              onClick={toggle}
              className="w-full flex items-center justify-center p-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white mb-2"
            >
              <ChevronRight size={18} />
            </button>
          )}

          {navItems.map((item, idx) => (
            <NavItem
              key={idx}
              to={item.to}
              icon={item.icon}
              collapsed={collapsed}
              onClick={() => setMobileOpen(false)}
              badge={item.badge}
            >
              {item.label}
            </NavItem>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 space-y-3">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-3 px-3 py-3 rounded-lg bg-white/10 text-gray-300 hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
          >
            <LogOut size={18} className={isLoggingOut ? "animate-spin" : ""} />
            {!collapsed && <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>}
          </button>

          {!collapsed && (
            <div className="text-xs text-gray-500 text-center pt-2">
              © {new Date().getFullYear()} Global Gateway
            </div>
          )}
        </div>
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-30 p-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 md:hidden shadow-lg"
      >
        <Menu size={20} />
      </button>

      <div className={`hidden md:block transition-all duration-300 ${collapsed ? "md:w-20" : "md:w-64"}`} />
    </>
  );
}
