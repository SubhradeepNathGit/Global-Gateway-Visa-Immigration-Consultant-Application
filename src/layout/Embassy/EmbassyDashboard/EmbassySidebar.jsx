import React, { useState, useEffect, useRef } from "react";
import { Home, FileText, Menu, LogOut, UserCircle, X, ChevronLeft, ChevronRight, Building2, BarChart2, Bell, Columns4, School } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSidebarStore } from "../../../util/useSidebarStore";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { logoutUser } from "../../../Redux/Slice/auth/checkAuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useApplicationStats } from "../../../tanstack/query/getApplicationStatsForEmbassy";
import { encodeBase64Url } from "../../../util/encodeDecode/base64";
import { fetchNotifications } from "../../../Redux/Slice/notificationSlice";

const NavItem = ({ to, icon: Icon, children, collapsed, onClick, badge }) => (
  <NavLink
    to={to} end onClick={onClick} className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-3 transition-all duration-200 text-sm font-medium relative group
     ${collapsed ? "justify-center" : ""}
     ${isActive ? collapsed ? "bg-white/10 text-white shadow-lg rounded-xl" : "bg-white/10 text-white shadow-lg rounded-lg"
        : collapsed ? "text-white/90 hover:bg-white/5 hover:text-white rounded-xl" : "text-white/90 hover:bg-white/5 hover:text-white rounded-lg"
      }`
    }
  >
    <div className="flex items-center justify-center w-6 flex-shrink-0">
      <Icon size={18} />
    </div>

    {!collapsed && (
      <>
        <span className="truncate flex-1">{children}</span>
        {badge && (
          <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
            {badge}
          </span>
        )}
      </>
    )}
  </NavLink>
);

export default function EmbassySidebar({ embassyData }) {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggle = useSidebarStore((s) => s.toggle);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const sidebarRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isNotificationLoading, notificationList, hasNotificationError } = useSelector(state => state?.notification);

  const { data: processingStats = [] } = useApplicationStats({
    countryId: embassyData?.country_id,
    statusFilter: "processing"
  });

  // notification 
  useEffect(() => {
    if (!embassyData?.country_id) return;

    dispatch(fetchNotifications({ receiver_type: 'embassy', receiver_country_id: embassyData?.country_id }))
      .then(res => {
        // console.log('Response for fetching notification', res)
      })
      .catch(err => {
        console.log('Error occured', err);
        // getSweetAlert("Oops...", "Something went wrong!", "error");
      })
  }, [dispatch, embassyData?.country_id]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser({ user_type: 'embassy', showAlert: true }));
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/embassy/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { to: "/embassy/dashboard", label: "Dashboard", icon: Home },
    {
      to: "/embassy/dashboard/profile",
      label: "Profile",
      icon: UserCircle
    },
    {
      to: "/embassy/dashboard/new-embassy",
      label: "Add New Embassy",
      icon: School
    },
    {
      to: "/embassy/dashboard/applications",
      label: "Applications",
      icon: FileText,
      badge: processingStats?.length
    },
    {
      to: "/embassy/dashboard/visa-policy-manage",
      label: "Manage Visa",
      icon: Columns4
    },
    {
      to: `/embassy/dashboard/notifications/${encodeBase64Url(String(embassyData?.country_id))}`,
      label: "Notifications",
      icon: Bell,
      badge: notificationList?.length
    },
    {
      to: "/embassy/dashboard/analytics",
      label: "Analytics",
      icon: BarChart2
    }

  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300
          bg-gradient-to-br from-cyan-700 to-blue-600/80 backdrop-blur-md
          border-r border-white/10
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{ boxShadow: "inset 0 0 40px rgba(255,255,255,0.02)" }}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div
            className={`flex items-center gap-3 transition-all duration-300 ${collapsed ? "w-14" : "w-48"
              } min-w-0`}
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg shadow-lg border border-white/10">
              <FlightTakeoffIcon fontSize="small" />
            </div>

            {!collapsed && (
              <h1 className="text-white font-semibold text-lg truncate">
                Global Gateway
              </h1>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={toggle}
              className="hidden md:flex p-2 rounded-lg hover:bg-white/5 text-white/90 hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 text-white/90 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {!collapsed && (
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                <Building2 size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  Embassy Panel
                </p>
                <p className="text-white/80 text-xs truncate">
                  {embassyData?.email || "embassy@global.com"}
                </p>
              </div>
            </div>
          </div>
        )}

        <nav className="glass-scrollbar flex-1 p-4 space-y-1 overflow-y-auto">
          {collapsed && (
            <button
              onClick={toggle}
              className="w-full flex items-center justify-center p-3 rounded-lg hover:bg-white/5 text-white/90 hover:text-white mb-2"
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

        <div className="p-4 border-t border-white/10 space-y-3">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-3 px-3 py-3 rounded-lg bg-white/10 text-white/90 hover:bg-red-500/20 hover:text-white cursor-pointer transition-all duration-200"
          >
            <LogOut size={18} className={isLoggingOut ? "animate-spin" : ""} />
            {!collapsed && (
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            )}
          </button>

          {!collapsed && (
            <div className="text-xs text-white/70 text-center pt-2">
              © {new Date().getFullYear()} Global Gateway
            </div>
          )}
        </div>
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-30 p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 md:hidden shadow-lg"
      >
        <Menu size={20} />
      </button>

      <div
        className={`hidden md:block transition-all duration-300 ${collapsed ? "md:w-20" : "md:w-64"
          }`}
      />
    </>
  );
}
