import { memo, useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HERO_FALLBACK_SRC } from '../util/heroBannerPreload';

const TITLE = 'Global Gateway';
const TYPE_SPEED_MS = 70;

// CSS animation durations (must match App.css keyframes)
const FLOAT_DUR  = 4800;
const RING_DUR   = 10000;
const BEAM_DUR   = 1600;
const DOT_DUR    = 1400;
const DOT_DELAYS = [0, 200, 400]; // stagger offsets for 3 dots

/**
 * Compute animation-delay values so that when React replaces the
 * static HTML DOM, every looping animation continues from the same
 * phase it was already at — no visible restart/snap.
 *
 * We call performance.now() ONCE outside the component so the value
 * is captured at module-eval time (before first render).
 */
const mountedAt = performance.now();

function getAnimDelays() {
  const t = mountedAt;
  return {
    float: `-${(t % FLOAT_DUR).toFixed(0)}ms`,
    ring:  `-${(t % RING_DUR).toFixed(0)}ms`,
    beam:  `-${(t % BEAM_DUR).toFixed(0)}ms`,
    dots:  DOT_DELAYS.map((off) => `-${((t + off) % DOT_DUR).toFixed(0)}ms`),
  };
}

/** Home splash only — no Redux (avoids re-renders during auth init). */
const LoadingAnimation = memo(function LoadingAnimation({ message: propMessage }) {
  const message = propMessage || 'Crafting Comfort Across Continents over a Decade';
  const [typed, setTyped] = useState('');
  const timerRef = useRef(null);

  // Compute once; stable across re-renders
  const delays = useRef(getAnimDelays()).current;

  useEffect(() => {
    let i = 0;
    setTyped('');

    const tick = () => {
      i += 1;
      setTyped(TITLE.slice(0, i));
      if (i < TITLE.length) {
        timerRef.current = setTimeout(tick, TYPE_SPEED_MS);
      }
    };

    timerRef.current = setTimeout(tick, TYPE_SPEED_MS);
    return () => clearTimeout(timerRef.current);
  }, []);

  // Lock scroll synchronously before first paint — useLayoutEffect fires before browser renders
  useLayoutEffect(() => {
    const html = document.documentElement;
    html.style.overflow = 'hidden';
    html.style.scrollbarGutter = 'auto';
    document.body.style.overflow = 'hidden';

    return () => {
      // Clear inline styles so the CSS stylesheet takes over — scrollbar returns naturally
      html.style.overflow = '';
      html.style.scrollbarGutter = '';
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="gg-splash-loader fixed inset-0 z-[9999] flex items-center justify-center select-none"
      style={{
        backgroundColor: '#0a0f14',
        backgroundImage: `url(${HERO_FALLBACK_SRC})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-busy="true"
      aria-label="Loading"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/85" />

      <div className="relative z-10 flex flex-col items-center gap-4 px-4 text-center" style={{ willChange: 'transform' }}>

        {/* Floating plane + spinning ring — synced to CSS phase */}
        <div className="relative gg-splash-loader__plane-wrap">
          <div
            className="gg-splash-loader__float"
            style={{ animationDelay: delays.float }}
          >
            <div className="w-[150px] h-[150px] rounded-full bg-white/12 border border-white/25 flex items-center justify-center shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
              <svg
                width="76"
                height="76"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white drop-shadow-[0_2px_10px_rgba(255,82,82,0.55)]"
                aria-hidden="true"
              >
                <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
            </div>
          </div>
          <div
            className="gg-splash-loader__ring absolute -top-[14px] -left-[14px] w-[178px] h-[178px] rounded-full border-2 border-transparent border-r-[#FF5252] border-b-[#FF5252]/60"
            style={{ animationDelay: delays.ring }}
          />
        </div>

        {/* Typewriter title — types smoothly from empty string */}
        <div className="mt-4">
          <h1
            className="text-[2rem] sm:text-[2.8rem] md:text-[4rem] font-bold text-white tracking-tight font-['Outfit'] drop-shadow-[0_4px_20px_rgba(0,0,0,0.75)]"
            style={{
              minHeight: '1.2em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label={TITLE}
          >
            {typed.split('').map((char, idx) => (
              <span
                key={idx}
                className="gg-typewriter-char"
                aria-hidden="true"
              >
                {char === ' ' ? '\u00a0' : char}
              </span>
            ))}
          </h1>
          <p
            className={`tracking-[0.22em] text-xs sm:text-sm mt-2 mb-5 font-medium uppercase font-['Inter'] ${
              propMessage ? 'text-[#FF5252] font-bold' : 'text-white/75'
            }`}
          >
            {message}
          </p>
        </div>

        {/* Sweeping loading beam — synced to CSS phase */}
        <div className="w-[min(430px,92vw)] h-[5px] rounded-full bg-white/15 overflow-hidden">
          <div
            className="gg-splash-loader__beam h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-[#FF5252] to-white/90"
            style={{ animationDelay: delays.beam }}
          />
        </div>

        {/* Pulsing dots — synced and staggered */}
        <div className="flex gap-3 mt-3" aria-hidden="true">
          {delays.dots.map((delay, i) => (
            <span
              key={i}
              className="gg-splash-loader__dot w-2 h-2 rounded-full bg-white/80"
              style={{ animationDelay: delay }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
});

export default LoadingAnimation;
