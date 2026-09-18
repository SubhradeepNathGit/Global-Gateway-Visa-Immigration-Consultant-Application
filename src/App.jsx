import { useEffect, useState } from 'react';
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

  // Only show the cinematic loader on the very first website load per session
  const [showInitialLoader, setShowInitialLoader] = useState(() => {
    return !sessionStorage.getItem('gg_initial_loaded');
  });

  useEffect(() => {
    // Initialize Auth Session and Listeners
    dispatch(checkLoggedInUser());
    dispatch(listenAuthChanges());

    if (showInitialLoader) {
      // First load: show cinematic loader, then dismiss permanently
      const timer = setTimeout(() => {
        dispatch(stopLoading());
        setShowInitialLoader(false);
        sessionStorage.setItem('gg_initial_loaded', 'true');
      }, 1100);

      return () => clearTimeout(timer);
    } else {
      // Already loaded once — kill loading state immediately
      dispatch(stopLoading());
    }
  }, [dispatch, showInitialLoader]);

  return (
    <>
      {/* GLOBAL CINEMATIC LOADER — only on first website load */}
      {showInitialLoader && <LoadingAnimation />}

      {/* APP UI rendered beneath for instant, zero-flicker transition */}
      <ToastContainer />
      <Toaster />
      <Routing />
    </>
  );
}

export default App;