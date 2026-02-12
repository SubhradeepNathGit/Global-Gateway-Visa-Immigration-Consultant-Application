import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import GlobalLiveChat from '../../Components/GlobalLiveChat';

const UserLayout = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Hide ONLY navbar on course details page
  const hideNavbar =
    pathname.startsWith('/coaching/course/') &&
    pathname !== '/coaching/course';

  // Hide BOTH navbar & footer on cart page
  const hideBoth = pathname === '/coaching/cart';

  return (
    <>
      {!hideNavbar && !hideBoth && <Navbar />}

      <Outlet />
      <GlobalLiveChat />

      {!hideBoth && <Footer />}
    </>
  );
};

export default UserLayout;
