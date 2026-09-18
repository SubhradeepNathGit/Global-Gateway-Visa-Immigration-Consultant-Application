import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { checkLoggedInUser } from '../../Redux/Slice/auth/checkAuthSlice';
import DashboardSkeleton from '../DashboardSkeleton';

/**
 * ProtectedRoute Component
 * @param {Element} children - The component to render if authorized
 * @param {Array} allowedRoles - Array of roles allowed to access this route (e.g., ['user', 'admin', 'embassy'])
 * @param {boolean} publicOnly - If true, only non-authenticated users can access (e.g., login page)
 */
const ProtectedRoute = ({ children, allowedRoles = [], publicOnly = false }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { isuserAuth, userAuthData, isuserLoading, isInitialized, isLoggingOut, isVerifying } = useSelector((state) => state.checkAuth);

    useEffect(() => {
        // Double check auth if not already initialized
        if (!isInitialized && !isuserLoading) {
            dispatch(checkLoggedInUser());
        }
    }, [dispatch, isInitialized, isuserLoading]);

    // Show loading while checking authentication OR logging out
    if (!isInitialized || isuserLoading || isLoggingOut) {
        // Use structural skeletons for Admin and Embassy dashboards
        if (location.pathname.startsWith('/admin')) {
            return <DashboardSkeleton type="admin" />;
        }
        if (location.pathname.startsWith('/embassy')) {
            return <DashboardSkeleton type="embassy" />;
        }

        // Lightweight spinner for user routes — no cinematic loader on navigation
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90">
                <div className="w-10 h-10 border-[3px] border-white/20 border-t-[#FF5252] rounded-full animate-spin" />
            </div>
        );
    }

    // Special case for public only routes (Login/Register/Reset Password)
    if (publicOnly && isuserAuth && !isVerifying) {
        // Redirect to their respective dashboard
        const role = userAuthData?.role;
        if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (role === 'embassy') return <Navigate to="/embassy/dashboard" replace />;
        return <Navigate to="/dashboard" replace />;
    }

    // If it's not a public only route and user is NOT authenticated
    if (!publicOnly && !isuserAuth) {
        // Redirect to authentication with the current location saved in state
        const redirectPath = location.pathname.startsWith('/admin') ? '/admin' : 
                           location.pathname.startsWith('/embassy') ? '/embassy' : 
                           '/authentication';
        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    // If role-based protection is requested
    if (allowedRoles.length > 0 && userAuthData) {
        const userRole = userAuthData.role;
        if (!allowedRoles.includes(userRole)) {
            // Unauthorized - redirect to their native dashboard or home
            const homePath = userRole === 'admin' ? '/admin/dashboard' : 
                           userRole === 'embassy' ? '/embassy/dashboard' : 
                           '/dashboard';
            return <Navigate to={homePath} replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
