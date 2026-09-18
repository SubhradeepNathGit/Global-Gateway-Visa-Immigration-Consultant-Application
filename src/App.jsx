import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import Routing from './Routing/Routing';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import LoadingAnimation from './Components/Loading';
import { useDispatch } from 'react-redux';
import { stopLoading } from './Redux/Slice/loadingSlice';
import { checkLoggedInUser, listenAuthChanges } from './Redux/Slice/auth/checkAuthSlice';

function App() {
  const dispatch = useDispatch();

  // Show the cinematic loader ONLY when refreshing on the home banner section (/)
  const [showInitialLoader, setShowInitialLoader] = useState(() => {
    const pathname = window.location.pathname;
    return pathname === '/' || pathname === '';
  });

  useEffect(() => {
    // Set root background to white now that React has mounted (prevents white flash)
    document.getElementById('root').style.backgroundColor = '#ffffff';

    // Initialize Auth Session and Listeners
    dispatch(checkLoggedInUser());
    dispatch(listenAuthChanges());

    if (showInitialLoader) {
      // Home page refresh: show cinematic loader, then dismiss
      const timer = setTimeout(() => {
        dispatch(stopLoading());
        setShowInitialLoader(false);
      }, 2200);

      return () => clearTimeout(timer);
    } else {
      // Not on home — kill loading state immediately
      dispatch(stopLoading());
    }
  }, [dispatch, showInitialLoader]);

  return (
    <>
      {/* CINEMATIC LOADER — only on home banner refresh */}
      <AnimatePresence mode="wait">
        {showInitialLoader && <LoadingAnimation alwaysShow={true} />}
      </AnimatePresence>

      {/* APP UI rendered beneath for instant, zero-flicker transition */}
      <ToastContainer />
      <Toaster />
      <Routing />
    </>
  );
}

export default App;