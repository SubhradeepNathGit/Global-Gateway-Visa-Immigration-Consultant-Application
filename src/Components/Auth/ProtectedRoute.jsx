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
    // Guard: if we're already authenticated and initialized, never tear down
    // the route tree just because a transient auth event fired (e.g. tab switch).
    const alreadyReady = isInitialized && isuserAuth;
    if ((!isInitialized || isLoggingOut) && !alreadyReady) {
        if (location.pathname.startsWith('/admin')) {
            return <DashboardSkeleton type="admin" />;
        }
        if (location.pathname.startsWith('/embassy')) {
            return <DashboardSkeleton type="embassy" />;
        }
        return <DashboardSkeleton type="user" />;
    }

    // Valid application roles from our DB
    const validApplicationRoles = ['admin', 'embassy', 'user'];

    // Special case for public only routes (Login/Register/Reset Password)
    if (publicOnly && isuserAuth && !isVerifying) {
        // Redirect to their respective dashboard ONLY once real application role is known
        const role = userAuthData?.role;
        if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (role === 'embassy') return <Navigate to="/embassy/dashboard" replace />;
        if (role === 'user') return <Navigate to="/dashboard" replace />;
        // Still resolving DB role — show skeleton instead of prematurely redirecting
        return <DashboardSkeleton type={location.pathname.startsWith('/embassy') ? 'embassy' : location.pathname.startsWith('/admin') ? 'admin' : 'user'} />;
    }

    // If it's not a public only route and user is NOT authenticated
    if (!publicOnly && !isuserAuth) {
        // Redirect to authentication with the current location saved in state
        const redirectPath = location.pathname.startsWith('/admin') ? '/admin' : 
                           location.pathname.startsWith('/embassy') ? '/embassy' : 
                           '/authentication';
        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    // If role-based protection is requested.
    // Guard: only enforce role redirect if userAuthData has a REAL application role
    // ('admin', 'embassy', 'user') populated from the database.
    // During an initial fetch, userAuthData may temporarily have Supabase's role='authenticated'
    // or undefined role, which must show skeleton and NEVER trigger an incorrect redirect loop!
    if (allowedRoles.length > 0) {
        const userRole = userAuthData?.role;

        // If the DB role has not loaded yet, wait with skeleton instead of redirecting
        if (!validApplicationRoles.includes(userRole)) {
            if (location.pathname.startsWith('/admin')) {
                return <DashboardSkeleton type="admin" />;
            }
            if (location.pathname.startsWith('/embassy')) {
                return <DashboardSkeleton type="embassy" />;
            }
            return <DashboardSkeleton type="user" />;
        }

        // Real application role is confirmed. If not authorized for this route, redirect to native dashboard
        if (!allowedRoles.includes(userRole)) {
            const homePath = userRole === 'admin' ? '/admin/dashboard' : 
                           userRole === 'embassy' ? '/embassy/dashboard' : 
                           '/dashboard';
            return <Navigate to={homePath} replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
