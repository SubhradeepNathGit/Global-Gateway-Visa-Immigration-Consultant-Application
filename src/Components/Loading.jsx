import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FlightIcon from '@mui/icons-material/Flight';
import { useSelector } from 'react-redux';

const LoadingAnimation = () => {
  const { isLoading, loadingMessage } = useSelector(
    (state) => state.loading || { isLoading: false, loadingMessage: '' }
  );

  const containerVariants = {
   
    animate: { opacity: 1 },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      transition: { duration: 0.5, ease: 'easeInOut' } 
    },
  };

  const planeVariants = {
    initial: { x: -100, opacity: 0, rotate: -10 },
    animate: {
      x: 0,
      opacity: 1,
      rotate: 0,
      transition: { duration: 1.2, ease: 'easeOut' },
    },
    float: {
      y: [-5, 5, -5],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
    takeoff: {
      y: -500,
      x: 100,
      rotate: -15,
      scale: 0.5,
      opacity: 0,
      transition: { duration: 1.5, ease: 'easeInOut' },
    },
  };

  const textVariants = {
    initial: { y: 30, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { delay: 0.8, duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: 'url("/Slider1.jpg")' }}
        >
          {/* Dark Blur Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[20px]" />

          {/* Floating circles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
              className="absolute rounded-full bg-white/5"
              style={{
                width: 80 + i * 20,
                height: 80 + i * 20,
                left: `${10 + i * 15}%`,
                top: `${10 + i * 10}%`,
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
                animate={!isLoading ? ['takeoff'] : ['animate', 'float']}
              >
                <div className="w-[140px] h-[140px] rounded-full bg-white/10 border border-white/10 flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                  <FlightIcon
                    style={{
                      fontSize: 80,
                      color: 'gray',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
                    }}
                  />
                </div>
              </motion.div>

              {/* Rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-[18px] -left-[18px] w-[180px] h-[180px] rounded-full border-t-4 border-r-4 border-white/30"
              />
            </div>

            {/* Title & subtitle */}
            <motion.div variants={textVariants} initial="initial" animate="animate">
              <h1 className="mt-5 text-[1.5rem] sm:text-[2rem] md:text-[4.5rem] font-bold text-white/20 drop-shadow">
                Global Gateway
              </h1>

              <p className="text-white/50 tracking-[0.1em] text-md sm:text-base mt-1 mb-5">
                Crafting Comfort Across Continents over a Decade
              </p>
            </motion.div>

            {/* Progress bar */}
            <div className="w-[430px] max-w-[100vw] h-[6px] rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full w-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 shadow-[0_2px_10px_rgba(239,68,68,0.4)]"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            {/* Dots */}
            <div className="flex gap-[15px] mt-5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: 'easeInOut',
                  }}
                  className="w-[16px] h-[16px] rounded-full bg-white/60 shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
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