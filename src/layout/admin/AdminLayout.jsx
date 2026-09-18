import React, { useEffect, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

export default function AdminLayout() {
  const { userAuthData } = useSelector(state => state.checkAuth);

  // Prevent back navigation from leaving the admin portal
  useEffect(() => {
    document.documentElement.style.backgroundColor = '#0b1020';
    document.body.style.backgroundColor = '#0b1020';
    window.history.pushState(null, document.title, window.location.href);
    const handlePopState = () => {
      if (window.location.pathname === '/admin/dashboard') {
        window.history.pushState(null, document.title, window.location.href);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);


  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Sidebar - Hidden on mobile (< 768px), visible on tablet/desktop */}
      <div className="hidden md:block">
        <Sidebar adminData={userAuthData} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar adminData={userAuthData} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-16 md:mt-[72px] lg:mt-[72px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0b1020] via-[#07080a] to-[#050506] overflow-x-hidden">
          <div className="max-w-full">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
            }>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}