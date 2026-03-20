import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { checkLoggedInUser } from '../../Redux/Slice/auth/checkAuthSlice';
import LoadingAnimation from '../Loading';

/**
 * ProtectedRoute Component
 * @param {Element} children - The component to render if authorized
 * @param {Array} allowedRoles - Array of roles allowed to access this route (e.g., ['user', 'admin', 'embassy'])
 * @param {boolean} publicOnly - If true, only non-authenticated users can access (e.g., login page)
 */
const ProtectedRoute = ({ children, allowedRoles = [], publicOnly = false }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { isuserAuth, userAuthData, isuserLoading, isInitialized, isLoggingOut } = useSelector((state) => state.checkAuth);

    useEffect(() => {
        // Double check auth if not already initialized
        if (!isInitialized && !isuserLoading) {
            dispatch(checkLoggedInUser());
        }
    }, [dispatch, isInitialized, isuserLoading]);

    // Show loading while checking authentication OR logging out
    if (!isInitialized || isuserLoading || isLoggingOut) {
        return <LoadingAnimation alwaysShow={true} message={isLoggingOut ? "Logging out..." : "Loading..."} />;
    }

    // Special case for public only routes (Login/Register/Reset Password)
    if (publicOnly && isuserAuth) {
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
                           location.pathname.startsWith('/embassy') ? '/embassy/auth' : 
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
