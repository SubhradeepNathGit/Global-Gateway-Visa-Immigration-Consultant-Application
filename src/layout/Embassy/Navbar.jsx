import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { checkLoggedInUser, logoutUser } from '../../Redux/Slice/auth/checkAuthSlice';
import MenuIcon from '@mui/icons-material/Menu';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const navLinks = [
  { label: 'Home', to: '/embassy/' },
  { label: 'About', to: '/embassy/about' },
  { label: 'Get in Touch', to: '/embassy/contact' },
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
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rightClickedLink, setRightClickedLink] = useState(null);
  const [clickedLink, setClickedLink] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isuserLoading, userAuthData, userError } = useSelector(state => state.checkAuth);

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

  const handleMenu = (e) => {
    e.stopPropagation();
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    dispatch(checkLoggedInUser())
      .then(res => {
        // console.log('Response for fetching user profile', res);
      })
      .catch((err) => {
        console.log("Error occurred", err);
      });
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser({ user_type: 'embassy', showAlert: true }))
      .then(res => {
        // console.log('Response for log out', res);
      })
      .catch(err => {
        console.log('Error occured', err);
      });
    handleClose();
    navigate('/embassy');
  };

  const handleRightClick = (e, label) => {
    e.preventDefault();
    setRightClickedLink(label);
  };

  return (
    <>
      {/* Main AppBar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-16 py-4 transition-all duration-400 shadow-none text-white ${
          scrolled
            ? 'bg-black/60 backdrop-blur-[10px] shadow-md'
            : 'bg-transparent'
        }`}
      >
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <FlightTakeoffIcon sx={{ fontSize: '30px', color: 'white' }} />
            <h1 className="text-white font-bold text-[25px] tracking-wider">
              Global Gateway
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    onClick={() => {
                      setClickedLink(link.label);
                      handleDropdownToggle(link.label);
                    }}
                    onContextMenu={(e) => handleRightClick(e, link.label)}
                    className={`flex items-center font-medium text-[15px] relative normal-case ${
                      clickedLink === link.label || rightClickedLink === link.label
                        ? 'text-red-500'
                        : 'text-white'
                    } after:content-[''] after:absolute after:w-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full`}
                  >
                    {link.label}
                    {openDropdown === link.label ? <ExpandLess /> : <ExpandMore />}
                  </button>
                  <AnimatePresence>
                    {openDropdown === link.label && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                        className="absolute top-full left-0 bg-black/60 min-w-[160px] shadow-[0_4px_12px_rgba(0,0,0,0.2)] z-20 rounded-[6px]"
                      >
                        {link.children.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.to}
                            onClick={() => setOpenDropdown(null)}
                            className="flex items-start w-full px-4 py-2 text-white normal-case font-medium hover:bg-white/5"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setClickedLink(link.label)}
                  onContextMenu={(e) => handleRightClick(e, link.label)}
                  className={`font-medium text-[15px] relative normal-case ${
                    clickedLink === link.label || rightClickedLink === link.label
                      ? 'text-red-500'
                      : 'text-white'
                  } after:content-[''] after:absolute after:w-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full`}
                >
                  {link.label}
                </Link>
              )
            )}

            {userAuthData ? (
              <div className="relative">
                <button onClick={handleMenu} className="p-0">
                  <img
                    src={userAuthData?.avatar_url || '/demo-user.png'}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </button>
                {anchorEl && (
                  <div className="absolute right-0 mt-2 min-w-[150px] bg-white rounded shadow-lg py-1 z-50">
                    <Link
                      to="/embassy/dashboard"
                      onClick={handleClose}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/embassy/auth"
                className="text-white font-normal normal-case"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={handleDrawerToggle}
              className="text-white p-2"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleDrawerToggle}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-black/70 text-red-500 z-50 md:hidden"
            >
              <div className="p-4">
                <h2 className="text-white font-bold text-xl mb-4">
                  Global Gateway
                </h2>

                {navLinks.map((link) => (
                  <div key={link.label} className="mb-2">
                    {link.children ? (
                      <div>
                        <button
                          onClick={() => handleDropdownToggle(link.label)}
                          className="w-full flex items-center justify-between text-white normal-case py-2"
                        >
                          {link.label}
                          {openDropdown === link.label ? <ExpandLess /> : <ExpandMore />}
                        </button>
                        {openDropdown === link.label && (
                          <div className="pl-4">
                            {link.children.map((sub) => (
                              <Link
                                key={sub.label}
                                to={sub.to}
                                onClick={handleDrawerToggle}
                                className="flex items-start w-full text-white normal-case font-medium py-2"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={link.to}
                        onClick={handleDrawerToggle}
                        className="flex items-start w-full text-white normal-case py-2"
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}

                {userAuthData ? (
                  <div className="mt-4 pt-4 border-t border-[#eee]">
                    <Link
                      to="/embassy/dashboard"
                      onClick={handleDrawerToggle}
                      className="flex items-start w-full mb-2 text-white normal-case py-2"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        handleDrawerToggle();
                      }}
                      className="w-full mt-4 normal-case bg-[#e53935] text-white rounded-lg py-[9.6px] font-semibold hover:bg-[#c62828]"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/embassy/auth"
                    onClick={handleDrawerToggle}
                    className="block w-full mt-4 text-center normal-case bg-[#e53935] text-white font-semibold py-[9.6px] rounded-[10px] shadow-[0_4px_14px_rgba(229,57,53,0.3)] hover:bg-[#c62828] hover:shadow-[0_6px_18px_rgba(229,57,53,0.4)]"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;