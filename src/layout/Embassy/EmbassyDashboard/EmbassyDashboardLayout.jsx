import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import EmbassySidebar from "./EmbassySidebar";
import EmbassyNavbar from "./EmbassyNavbar";
import { useSidebarStore } from "../../../util/useSidebarStore";
import { useDispatch, useSelector } from "react-redux";
import { checkLoggedInUser } from "../../../Redux/Slice/auth/checkAuthSlice";
import getSweetAlert from "../../../util/alert/sweetAlert";
import { fetchEmbassyById } from "../../../Redux/Slice/embassySlice";
import { useFullCountryDetails } from "../../../tanstack/query/getCountryDetails";

const EmbassyDashboardLayout = () => {
    const collapsed = useSidebarStore((s) => s.collapsed);
    const dispatch = useDispatch();
    const { userAuthData } = useSelector(state => state.checkAuth);
    const { embassyData } = useSelector(state => state.embassy);
    const { data: countryDetails } = useFullCountryDetails(embassyData?.country_id);

    // Redundant checkLoggedInUser removed (already handled by App.jsx and ProtectedRoute)

    useEffect(() => {
        if (userAuthData) {
            dispatch(fetchEmbassyById(userAuthData?.id))
                .then(res => {
                    // console.log('Response for fetching embassy profile', res);
                })
                .catch((err) => {
                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                    console.log("Error occurred", err);
                });
        }
    }, [dispatch, userAuthData?.id]);

    // Prevent back navigation from leaving the embassy portal
    useEffect(() => {
        window.history.pushState(null, document.title, window.location.href);
        const handlePopState = () => {
            if (window.location.pathname === '/embassy/dashboard') {
                window.history.pushState(null, document.title, window.location.href);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // console.log(isuserLoading);
    // console.log(isEmbassyLoading);
    // console.log(isCountryLoading);



    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar - Fixed position with high z-index */}
            <EmbassySidebar embassyData={embassyData} />

            {/* Main Content Area */}
            <div
                className={`transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"
                    }`}
            >
                {/* Navbar - Fixed at top with proper z-index */}
                <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
                    <EmbassyNavbar embassyData={embassyData} countryDetails={countryDetails} />
                </div>

                {/* Page Content */}
                <main className="min-h-screen bg-gray-50">
                    <div className="p-4 mt-15 md:p-6 lg:p-10 ">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EmbassyDashboardLayout;