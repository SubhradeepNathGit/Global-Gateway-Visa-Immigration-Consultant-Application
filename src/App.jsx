import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();

  // Show the cinematic loader ONLY when refreshing on the home banner section (/)
  const [showInitialLoader, setShowInitialLoader] = useState(() => {
    const pathname = window.location.pathname;
    return pathname === '/' || pathname === '';
  });

  useEffect(() => {
    const p = location.pathname;
    let targetBg = '#ffffff';

    if (p === '/' || p === '') {
      targetBg = '#000000';
    } else if (p.startsWith('/admin')) {
      targetBg = '#0b1020';
    } else if (p.startsWith('/embassy')) {
      targetBg = '#f9fafb';
    } else if (p.startsWith('/dashboard')) {
      targetBg = '#f8fafc';
    }

    const rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.style.backgroundColor = targetBg;
    }
    document.documentElement.style.backgroundColor = targetBg;
    document.body.style.backgroundColor = targetBg;
  }, [location.pathname]);

  // Initialize Auth Session and Listeners + cinematic loader
  useEffect(() => {
    dispatch(checkLoggedInUser());
    dispatch(listenAuthChanges());

    if (showInitialLoader) {
      let isCancelled = false;

      // Robust image preloader with off-main-thread decode for zero-jitter paint
      const preloadAndDecode = (src) => {
        return new Promise((resolve) => {
          if (!src) return resolve();
          const img = new Image();
          img.src = src;

          const handleLoaded = () => {
            if ('decode' in img) {
              img.decode().then(resolve).catch(resolve);
            } else {
              resolve();
            }
          };

          if (img.complete && img.naturalWidth > 0) {
            handleLoaded();
          } else {
            img.onload = handleLoaded;
            img.onerror = resolve; // Continue gracefully on network failure
          }
        });
      };

      // 1. Minimum cinematic flight duration (1.9s)
      const minDurationPromise = new Promise((resolve) => setTimeout(resolve, 1900));

      // 2. Full download & GPU decode of the critical hero banner images
      const bannerImagesPromise = Promise.all([
        preloadAndDecode('/Slider1.jpg'),
        preloadAndDecode('/Slider7.jpg'),
        preloadAndDecode('/Slider2.jpg'),
      ]);

      // 3. Safety ceiling (4.5s) to guarantee no infinite hang on offline/slow 2G
      const maxSafetyCeiling = new Promise((resolve) => setTimeout(resolve, 4500));

      Promise.race([
        Promise.all([minDurationPromise, bannerImagesPromise]),
        maxSafetyCeiling,
      ]).then(() => {
        if (!isCancelled) {
          dispatch(stopLoading());
          setShowInitialLoader(false);
        }
      });

      return () => {
        isCancelled = true;
      };
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