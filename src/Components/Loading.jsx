import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FlightIcon from '@mui/icons-material/Flight';
import { useSelector } from 'react-redux';

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
    initial: { x: -60, opacity: 0, scale: 0.9 },
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
    },
    float: {
      y: [-6, 6, -6],
      transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
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
          {/* Dark Blur Overlay */}
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[24px]" />

          {/* Floating subtle ambient orbs */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, 80, 0],
                y: [0, -80, 0],
                opacity: [0.04, 0.12, 0.04],
              }}
              transition={{
                duration: 9 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.6,
              }}
              className="absolute rounded-full bg-white/5 pointer-events-none"
              style={{
                width: 90 + i * 25,
                height: 90 + i * 25,
                left: `${12 + i * 18}%`,
                top: `${12 + i * 14}%`,
              }}
            />
          ))}

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center gap-4 px-4 text-center">
            {/* Plane */}
            <div className="relative">
              <motion.div
                variants={planeVariants}
                initial="initial"
                animate={['animate', 'float']}
              >
                <div className="w-[130px] h-[130px] rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(255,82,82,0.25)]">
                  <FlightIcon
                    style={{
                      fontSize: 66,
                      color: '#ffffff',
                      filter: 'drop-shadow(0 4px 14px rgba(255,82,82,0.6))',
                    }}
                  />
                </div>
              </motion.div>

              {/* Rotating accent ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-[14px] -left-[14px] w-[158px] h-[158px] rounded-full border-2 border-transparent border-t-[#FF5252] border-r-[#FF5252]/60 shadow-[0_0_15px_rgba(255,82,82,0.4)]"
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

            {/* Progress bar */}
            <div className="w-[430px] max-w-[100vw] h-[6px] rounded-full bg-white/15 overflow-hidden">
              <motion.div
                className="h-full w-full bg-gradient-to-r from-transparent via-[#FF5252] to-white shadow-[0_0_12px_#FF5252]"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>

            {/* Dots */}
            <div className="flex gap-3 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0.9, 0.35] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: 'easeInOut',
                  }}
                  className="w-2 h-2 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
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