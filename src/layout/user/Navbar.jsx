import React, { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { checkLoggedInUser, logoutUser } from '../../Redux/Slice/auth/checkAuthSlice';
import { Link } from 'react-router-dom';
import NotificationDrawer from '../../Components/user/common/NotificationDrawer';
import { fetchNotifications } from '../../Redux/Slice/notificationSlice';
import { fetchCartItems, getOrCreateCart } from '../../Redux/Slice/cartSlice';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Countries', to: '/country' },
  { label: 'Courses', to: '/course' },
  { label: 'Get in Touch', to: '/contact' },
];

const dropdownVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rightClickedLink, setRightClickedLink] = useState(null);
  const [clickedLink, setClickedLink] = useState(null);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isuserLoading, userAuthData, userError } = useSelector(state => state.checkAuth);
  const { isNotificationLoading, notificationList, hasNotificationError } = useSelector(state => state?.notification);
  const { isCartLoading, cartItems, currentCart, hasCartError } = useSelector(state => state.cart);

  // Handle responsive breakpoint
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDropdownToggle = (label) => {
    setOpenDropdown(prev => (prev === label ? null : label));
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(prev => !prev);
    setOpenDropdown(null);
  };

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    dispatch(checkLoggedInUser())
      .then(res => {
        // console.log('Response for fetching user profile', res);
      })
      .catch((err) => {
        console.log("Error occurred", err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      });
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser({ user_type: 'user', showAlert: true }))
      .then(res => {
        // console.log('Response for log out', res);
      })
      .catch(err => {
        console.log('Error occured', err);
      });
    handleClose();
    navigate('/');
  };

  // notification 
  useEffect(() => {
    if (!userAuthData?.id) return;

    dispatch(fetchNotifications({ receiver_type: 'user', user_id: userAuthData?.id }))
      .then(res => {
        // console.log('Response for fetching notification', res);
      })
      .catch(err => {
        console.log('Error occured', err);
        // getSweetAlert("Oops...", "Something went wrong!", "error");
      })
  }, [dispatch, userAuthData?.id]);

  useEffect(() => {
    dispatch(getOrCreateCart(userAuthData?.id))
      .then(res => {
        // console.log('Response for getting cart details for specific user', res);

        dispatch(fetchCartItems(res?.payload?.id))
          .then(res => {
            // console.log('Response for fetching cart items', res);
          })
          .catch(err => {
            console.log('Error occured', err);
            getSweetAlert('Oops...', 'Something went wrong!', 'error');
          })
      })
      .catch(err => {
        console.log(err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }, [userAuthData?.id, dispatch]);

  const handleRightClick = (e, label) => {
    e.preventDefault();
    setRightClickedLink(label);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-16 py-4 transition-all duration-400 ${scrolled
          ? 'bg-black/60 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
          }`}
      >
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <FlightTakeoffIcon className="text-white text-[30px]" />
            <h1 className="text-white font-bold text-[25px] tracking-wide">
              Global Gateway
            </h1>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex gap-12 items-center">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label} className="relative">
                    <button
                      onClick={() => {
                        setClickedLink(link.label);
                        handleDropdownToggle(link.label);
                      }}
                      onContextMenu={(e) => handleRightClick(e, link.label)}
                      className={`${clickedLink === link.label || rightClickedLink === link.label
                        ? 'text-red-600'
                        : 'text-white'
                        } font-medium text-[15px] relative flex items-center gap-1 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full`}
                    >
                      {link.label} {openDropdown === link.label ? <ExpandLess /> : <ExpandMore />}
                    </button>
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <Motion.div
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={dropdownVariants}
                          className="absolute top-full left-0 bg-black/60 min-w-[160px] shadow-lg z-20 rounded-md"
                        >
                          {link.children.map((sub) => (
                            <RouterLink
                              key={sub.label}
                              to={sub.to}
                              onClick={() => setOpenDropdown(null)}
                              className="block w-full text-left px-8 py-4 text-white font-medium hover:bg-white/10"
                            >
                              {sub.label}
                            </RouterLink>
                          ))}
                        </Motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <RouterLink
                    key={link.label}
                    to={link.to}
                    onClick={() => setClickedLink(link.label)}
                    onContextMenu={(e) => handleRightClick(e, link.label)}
                    className={`${clickedLink === link.label || rightClickedLink === link.label ? 'text-red-600' : 'text-white'
                      } font-medium text-[15px] relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full`}
                  >
                    {link.label}
                  </RouterLink>
                )
              )}

              {/* Cart Icon - Only show when user is logged in */}
              {userAuthData && (
                <Link
                  to='/cart'
                  className="text-white hover:bg-white/10 rounded-full p-2 transition-colors"
                >
                  <div className="relative">
                    <ShoppingCartIcon />
                    {/* Badge placeholder - uncomment when cartCount is available */}
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[0.75rem] h-[18px] min-w-[18px] flex items-center justify-center rounded-full">
                      {cartItems?.length ?? 0}
                    </span>
                  </div>
                </Link>
              )}

              {/* Notification Bell - Only show when user is logged in */}
              {userAuthData && (
                <button
                  onClick={() => setNotificationDrawerOpen(true)}
                  className="text-white hover:bg-white/10 rounded-full p-2 transition-colors cursor-pointer"
                >
                  <div className="relative">
                    <NotificationsIcon />
                    {/* Badge showing notification count */}
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[0.75rem] h-[18px] min-w-[18px] flex items-center justify-center rounded-full">
                      {notificationList?.length ?? 0}
                    </span>
                  </div>
                </button>
              )}

              {userAuthData ? (
                <>
                  <button onClick={handleMenu} className="p-0">
                    <img
                      src={userAuthData?.avatar_url || '/demo-user.png'}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </button>
                  {/* User Menu Dropdown */}
                  {anchorEl && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={handleClose}
                      />
                      {/* Menu */}
                      <div
                        className="absolute top-16 right-16 mt-4 min-w-[150px] bg-white rounded-md shadow-lg z-50"
                      >
                        <RouterLink
                          to="/dashboard"
                          onClick={handleClose}
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          Dashboard
                        </RouterLink>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <RouterLink
                  to="/authentication"
                  className="text-white font-medium hover:bg-white/10 px-4 py-2 rounded transition-colors"
                >
                  Get Started
                </RouterLink>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <div className="flex items-center gap-4">
              {/* Mobile Cart Icon - Only show when user is logged in */}
              {userAuthData && (
                <Link
                  to='/cart'
                  className="text-white hover:bg-white/10 rounded-full p-2 transition-colors"
                >
                  <div className="relative">
                    <ShoppingCartIcon />
                    {/* Badge placeholder */}
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[0.75rem] h-[18px] min-w-[18px] flex items-center justify-center rounded-full">
                      {cartItems?.length ?? 0}
                    </span>
                  </div>
                </Link>
              )}

              {/* Mobile Notification Bell - Only show when user is logged in */}
              {userAuthData && (
                <button
                  onClick={() => setNotificationDrawerOpen(true)}
                  className="text-white hover:bg-white/10 rounded-full p-2 transition-colors cursor-pointer"
                >
                  <div className="relative">
                    <NotificationsIcon />
                    {/* Badge showing notification count */}
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[0.75rem] h-[18px] min-w-[18px] flex items-center justify-center rounded-full">
                      {notificationList?.length ?? 0}
                    </span>
                  </div>
                </button>
              )}

              <button
                onClick={handleDrawerToggle}
                className="text-white"
              >
                <MenuIcon />
              </button>
            </div>
          )}
        </div>
      </nav>

      <NotificationDrawer
        notificationList={notificationList} userAuthData={userAuthData} isOpen={notificationDrawerOpen} onClose={() => setNotificationDrawerOpen(false)} />

      {/* Mobile Navigation Drawer */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleDrawerToggle}
          />

          {/* Drawer */}
          <div className="fixed left-0 top-0 bottom-0 w-[280px] bg-black/70 text-red-600 z-50 p-8 overflow-y-auto">
            <h6 className="mb-8 font-bold text-xl">
              Global Gateway
            </h6>

            {navLinks?.map(link => (
              <div key={link.label} className="mb-4">
                {link.children ? (
                  <div>
                    <button
                      onClick={() => handleDropdownToggle(link.label)}
                      className="w-full flex justify-between items-center text-white font-medium"
                    >
                      {link.label}
                      {openDropdown === link.label ? <ExpandLess /> : <ExpandMore />}
                    </button>
                    {openDropdown === link.label && (
                      <div className="pl-8 mt-2">
                        {link.children.map((sub) => (
                          <RouterLink
                            key={sub.label}
                            to={sub.to}
                            onClick={handleDrawerToggle}
                            className="block w-full text-left py-2 text-white font-medium"
                          >
                            {sub.label}
                          </RouterLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <RouterLink
                    to={link.to}
                    onClick={handleDrawerToggle}
                    className="block w-full text-left text-white font-medium"
                  >
                    {link.label}
                  </RouterLink>
                )}
              </div>
            ))}

            {userAuthData ? (
              <div className="mt-8 pt-8 border-t border-gray-300">
                <RouterLink
                  to='/dashboard'
                  onClick={handleDrawerToggle}
                  className="block w-full text-left mb-4 text-white font-medium"
                >
                  Dashboard
                </RouterLink>
                <RouterLink
                  to="/cart"
                  onClick={handleDrawerToggle}
                  className="block w-full text-left mb-4 text-white font-medium"
                >
                  My Cart
                </RouterLink>
                <button
                  onClick={() => {
                    handleLogout();
                    handleDrawerToggle();
                  }}
                  className="w-full mt-8 bg-[#e53935] text-white rounded-lg py-[9.6px] font-semibold hover:bg-[#c62828] transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <RouterLink
                to="/authentication"
                onClick={handleDrawerToggle}
                className="block w-full mt-8 bg-[#e53935] text-white font-semibold py-[9.6px] rounded-[10px] shadow-[0_4px_14px_rgba(229,57,53,0.3)] hover:bg-[#c62828] hover:shadow-[0_6px_18px_rgba(229,57,53,0.4)] transition-all text-center"
              >
                Get Started
              </RouterLink>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;