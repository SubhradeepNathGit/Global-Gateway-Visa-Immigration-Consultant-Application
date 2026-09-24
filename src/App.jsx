import { useEffect, useLayoutEffect, useState } from 'react';
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
import AuthVideoPreloader from './Components/Auth/AuthVideoPreloader';
import { warmHeroBannerImages, HERO_FALLBACK_SRC } from './util/heroBannerPreload';
import PersistentHeroBackdrop from './Components/user/home/PersistentHeroBackdrop';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  // Show the cinematic loader ONLY when refreshing on the home banner section (/)
  const [showInitialLoader, setShowInitialLoader] = useState(() => {
    const pathname = window.location.pathname;
    return pathname === '/' || pathname === '';
  });

  useLayoutEffect(() => {
    const p = location.pathname;
    const isHome = p === '/' || p === '';
    let targetBg = '#ffffff';
    let targetBgImage = '';

    if (isHome) {
      targetBg = '#0a0f14';
      targetBgImage = `url(${HERO_FALLBACK_SRC})`;
    } else if (p.startsWith('/admin')) {
      targetBg = '#0b1020';
    } else if (p.startsWith('/embassy')) {
      targetBg = '#f9fafb';
    } else if (p.startsWith('/dashboard')) {
      targetBg = '#f8fafc';
    }

    const rootEl = document.getElementById('root');
    const applyBg = (el) => {
      if (!el) return;
      el.style.backgroundColor = targetBg;
      el.style.backgroundImage = targetBgImage;
      el.style.backgroundSize = targetBgImage ? 'cover' : '';
      el.style.backgroundPosition = targetBgImage ? 'center top' : '';
      el.style.backgroundRepeat = 'no-repeat';
    };

    applyBg(rootEl);
    applyBg(document.documentElement);
    applyBg(document.body);

    if (isHome) {
      void warmHeroBannerImages();
    }
  }, [location.pathname]);

  useEffect(() => {
    const onPageShow = () => {
      const p = window.location.pathname;
      if (p === '/' || p === '') {
        void warmHeroBannerImages();
      }
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

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

      // Short splash + one hero decode (extra slides warm in background — avoids main-thread jank)
      const minDurationPromise = new Promise((resolve) => setTimeout(resolve, 1100));
      const heroReadyPromise = preloadAndDecode('/Slider-front1.jpg');
      const maxSafetyCeiling = new Promise((resolve) => setTimeout(resolve, 2800));

      Promise.race([
        Promise.all([minDurationPromise, heroReadyPromise]),
        maxSafetyCeiling,
      ]).then(() => {
        if (!isCancelled) {
          dispatch(stopLoading());
          requestAnimationFrame(() => {
            if (!isCancelled) setShowInitialLoader(false);
          });
          void warmHeroBannerImages();
        }
      });

      return () => {
        isCancelled = true;
      };
    } else {
      // Not on home — kill loading state immediately and idle-warm the hero image
      dispatch(stopLoading());
      const idleImg = new Image();
      idleImg.src = '/Slider-front1.jpg';
      if ('decode' in idleImg) {
        idleImg.decode().catch(() => {});
      }
    }
  }, [dispatch, showInitialLoader]);

  return (
    <>
      <PersistentHeroBackdrop />

      <div className="relative z-[1] min-h-screen">
        {/* CINEMATIC LOADER — only on home banner refresh */}
        <AnimatePresence>
          {showInitialLoader && <LoadingAnimation />}
        </AnimatePresence>

        <AuthVideoPreloader />

        <ToastContainer />
        <Toaster />
        <Routing />
      </div>
    </>
  );
}

export default App;