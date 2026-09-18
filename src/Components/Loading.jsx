import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FlightIcon from '@mui/icons-material/Flight';
import { useSelector } from 'react-redux';

/* ── CSS for GPU-accelerated repeating animations ── */
const loaderStyles = `
  @keyframes loader-float {
    0%, 100% { transform: translateY(0); }
    30% { transform: translateY(-10px); }
    60% { transform: translateY(-6px); }
    80% { transform: translateY(-10px); }
  }
  @keyframes loader-ring-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes loader-beam {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes loader-dot {
    0%, 100% { transform: scale(1); opacity: 0.35; }
    50% { transform: scale(1.35); opacity: 0.9; }
  }
`;

const LoadingAnimation = ({ alwaysShow = false, message: propMessage }) => {
  const { isLoading: globalLoading, loadingMessage: reduxMessage } = useSelector(
    (state) => state.loading || { isLoading: false, loadingMessage: '' }
  );

  const isLoading = alwaysShow || globalLoading;
  const message = propMessage || reduxMessage;

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      scale: 1.04,
      filter: 'blur(16px)',
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
    },
  };

  const planeVariants = {
    initial: { x: -300, y: 80, opacity: 0, scale: 0.85, rotate: -45 },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { type: 'spring', stiffness: 40, damping: 18, mass: 1.2 },
    },
  };

  const textVariants = {
    initial: { y: 20, opacity: 0, filter: 'blur(8px)' },
    animate: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-cover bg-center select-none"
          style={{ backgroundImage: 'url("/Slider1.jpg")' }}
        >
          {/* Inject CSS keyframes */}
          <style>{loaderStyles}</style>

          {/* Dark Blur Overlay */}
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[24px]" />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center gap-4 px-4 text-center">
            {/* Plane */}
            <div className="relative">
              <motion.div
                variants={planeVariants}
                initial="initial"
                animate="animate"
              >
                {/* Float via CSS animation (GPU) */}
                <div style={{ animation: 'loader-float 5.5s ease-in-out infinite', willChange: 'transform' }}>
                  <div className="w-[150px] h-[150px] rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(255,82,82,0.25)]">
                    <FlightIcon
                      style={{
                        fontSize: 66,
                        color: '#ffffff',
                        filter: 'drop-shadow(0 4px 14px rgba(255,82,82,0.6))',
                      }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Rotating accent ring — CSS animation (GPU) */}
              <div
                className="absolute -top-[14px] -left-[14px] w-[178px] h-[178px] rounded-full border-2 border-transparent border-r-[#FF5252] border-b-[#FF5252]/60 shadow-[0_0_15px_rgba(255,82,82,0.4)]"
                style={{ animation: 'loader-ring-spin 9.5s linear infinite', willChange: 'transform' }}
              />
            </div>

            {/* Title & subtitle */}
            <motion.div variants={textVariants} initial="initial" animate="animate">
              <h1 className="mt-6 text-[2rem] sm:text-[2.8rem] md:text-[4rem] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white/95 to-white/70 tracking-tight font-['Outfit'] drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
                Global Gateway
              </h1>

              <p className={`tracking-[0.22em] text-xs sm:text-sm mt-2 mb-6 font-medium uppercase font-['Inter'] ${propMessage ? 'text-[#FF5252] font-bold' : 'text-white/75'}`}>
                {message || 'Crafting Comfort Across Continents over a Decade'}
              </p>
            </motion.div>

            {/* Progress bar — CSS animation (GPU) */}
            <div className="w-[430px] max-w-[100vw] h-[6px] rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full w-full bg-gradient-to-r from-transparent via-[#FF5252] to-white shadow-[0_0_12px_#FF5252]"
                style={{ animation: 'loader-beam 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite', willChange: 'transform' }}
              />
            </div>

            {/* Dots — CSS animation (GPU) */}
            <div className="flex gap-3 mt-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                  style={{
                    animation: `loader-dot 1.8s ease-in-out ${i * 0.3}s infinite`,
                    willChange: 'transform, opacity',
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingAnimation;