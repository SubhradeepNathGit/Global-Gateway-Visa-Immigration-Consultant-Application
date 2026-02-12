import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { checkLoggedInUser } from "../../Redux/Slice/auth/checkAuthSlice";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const { isuserLoading, userAuthData, userError } = useSelector(state => state.checkAuth);

  useEffect(() => {
    dispatch(checkLoggedInUser())
      .then(res => {
        // console.log('Response for fetching user profile', res);
      })
      .catch((err) => {
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
        console.log("Error occurred", err);
      });
  }, [dispatch]);

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
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}