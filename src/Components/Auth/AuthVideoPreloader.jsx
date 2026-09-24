import React, { useEffect, useRef } from 'react';

/**
 * Global background helper to trigger preloading on interaction (e.g. mouse hover on Get Started)
 */
export const warmUpAuthMedia = () => {
  if (typeof window === 'undefined') return;

  const videos = [
    '/signup.mp4',
    '/registration.mp4',
    '/admin-signin.mp4',
    '/embassy-signin.mp4',
    '/embassy-signup.mp4',
  ];

  videos.forEach((src) => {
    try {
      const v = document.createElement('video');
      v.preload = 'auto';
      v.muted = true;
      v.playsInline = true;
      v.src = src;
      v.load();
    } catch {
      // Ignore
    }
  });
};

/**
 * AuthVideoPreloader
 * Renders silent, hardware-accelerated offscreen video players and preloads preview posters
 * so that when users navigate to Sign In / Sign Up, videos start instantly with zero jitter.
 */
const AuthVideoPreloader = () => {
  const preloadedRef = useRef(false);
  const signupRef = useRef(null);
  const regRef = useRef(null);
  const adminRef = useRef(null);
  const embassySignInRef = useRef(null);
  const embassySignUpRef = useRef(null);

  useEffect(() => {
    if (preloadedRef.current) return;
    preloadedRef.current = true;

    // 1. Preload and GPU-decode high-resolution poster images
    const posters = [
      '/signup-preview.png',
      '/registration-preview.png',
      '/admin1.png',
      '/embassy1.png',
      '/embassy2.png',
    ];

    posters.forEach((src) => {
      const img = new Image();
      img.src = src;
      if ('decode' in img) {
        img.decode().catch(() => {});
      }
    });

    // 2. Schedule video preloading during idle or slight delay so main hero doesn't compete
    const startWarmup = () => {
      [signupRef, regRef, adminRef, embassySignInRef, embassySignUpRef].forEach((ref) => {
        if (ref.current) {
          ref.current.muted = true;
          ref.current.preload = 'auto';
          try {
            ref.current.load();
          } catch {
            // Ignore
          }
        }
      });
    };

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(startWarmup, { timeout: 1500 });
      return () => window.cancelIdleCallback(idleId);
    } else {
      const timerId = setTimeout(startWarmup, 500);
      return () => clearTimeout(timerId);
    }
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: -9999,
        left: -9999,
        width: 1,
        height: 1,
        opacity: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        visibility: 'hidden',
        zIndex: -9999,
      }}
      tabIndex={-1}
    >
      <video ref={signupRef} src="/signup.mp4" preload="auto" muted playsInline />
      <video ref={regRef} src="/registration.mp4" preload="auto" muted playsInline />
      <video ref={adminRef} src="/admin-signin.mp4" preload="auto" muted playsInline />
      <video ref={embassySignInRef} src="/embassy-signin.mp4" preload="auto" muted playsInline />
      <video ref={embassySignUpRef} src="/embassy-signup.mp4" preload="auto" muted playsInline />
    </div>
  );
};

export default AuthVideoPreloader;
