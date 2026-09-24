import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { HERO_FALLBACK_SRC } from '../util/heroBannerPreload';

/** Home splash only — no Redux (avoids re-renders during auth init). GPU-friendly: no fullscreen blur. */
const LoadingAnimation = memo(function LoadingAnimation({ message: propMessage }) {
  const message = propMessage || 'Crafting Comfort Across Continents over a Decade';

  return (
    <motion.div
      initial={{ opacity: 0 }}
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/80" />

      <div className="relative z-10 flex flex-col items-center gap-4 px-4 text-center">
        <div className="relative gg-splash-loader__plane-wrap">
          <div className="gg-splash-loader__float">
            <div className="w-[132px] h-[132px] sm:w-[150px] sm:h-[150px] rounded-full bg-white/12 border border-white/25 flex items-center justify-center shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white drop-shadow-[0_2px_10px_rgba(255,82,82,0.55)]"
                aria-hidden="true"
              >
                <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
            </div>
          </div>
          <div className="gg-splash-loader__ring absolute -top-3 -left-3 sm:-top-[14px] sm:-left-[14px] w-[158px] h-[158px] sm:w-[178px] sm:h-[178px] rounded-full border-2 border-transparent border-r-[#FF5252] border-b-[#FF5252]/60" />
        </div>

        <div className="gg-splash-loader__fade-up mt-4">
          <h1 className="text-[2rem] sm:text-[2.8rem] md:text-[4rem] font-bold text-white tracking-tight font-['Outfit'] drop-shadow-[0_4px_20px_rgba(0,0,0,0.75)]">
            Global Gateway
          </h1>
          <p
            className={`tracking-[0.22em] text-xs sm:text-sm mt-2 mb-5 font-medium uppercase font-['Inter'] ${
              propMessage ? 'text-[#FF5252] font-bold' : 'text-white/75'
            }`}
          >
            {message}
          </p>
        </div>

        <div className="w-[min(430px,92vw)] h-[5px] rounded-full bg-white/15 overflow-hidden">
          <div className="gg-splash-loader__beam h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-[#FF5252] to-white/90" />
        </div>

        <div className="flex gap-3 mt-3" aria-hidden="true">
          <span className="gg-splash-loader__dot w-2 h-2 rounded-full bg-white/80" />
          <span className="gg-splash-loader__dot w-2 h-2 rounded-full bg-white/80 [animation-delay:0.2s]" />
          <span className="gg-splash-loader__dot w-2 h-2 rounded-full bg-white/80 [animation-delay:0.4s]" />
        </div>
      </div>
    </motion.div>
  );
});

export default LoadingAnimation;
