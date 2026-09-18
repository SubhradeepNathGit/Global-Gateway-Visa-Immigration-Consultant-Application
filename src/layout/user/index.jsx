import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import Footer from './Footer';
import GlobalLiveChat from '../../Components/GlobalLiveChat';

const UserLayout = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { isuserAuth, userAuthData } = useSelector((state) => state.checkAuth);

  // If logged in as admin or embassy, hitting back button or navigating to user pages must redirect back to their portal
  if (isuserAuth) {
    if (userAuthData?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (userAuthData?.role === 'embassy') {
      return <Navigate to="/embassy/dashboard" replace />;
    }
  }

  // Hide ONLY navbar on course details page
  const hideNavbar =
    pathname.startsWith('/coaching/course/') &&
    pathname !== '/coaching/course';

  // Hide BOTH navbar & footer on cart page
  const hideBoth = pathname === '/coaching/cart';

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {!hideNavbar && !hideBoth && <Navbar />}

      <div className="flex-1 bg-white">
        <Outlet />
      </div>
      <GlobalLiveChat />

      {!hideBoth && <Footer />}
    </div>
  );
};

export default UserLayout;
