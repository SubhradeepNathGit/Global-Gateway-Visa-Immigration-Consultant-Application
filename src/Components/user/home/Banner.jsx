import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const bannerData = [
  {
    image: '/Slider-front1.jpg',
    title: 'APPLY FOR VISA',
    subtitle: 'GO BEYOND BORDERS',
  },
  {
    image: '/Slider2.jpg',
    title: 'EXPLORE THE WORLD',
    subtitle: 'WITH EASE',
  },
  {
    image: '/Slider3.jpg',
    title: 'PLAN YOUR BUCKETLIST',
    subtitle: 'WITH US',
  },
  {
    image: '/Slider6.jpg',
    title: 'YOUR DREAM JOURNEY',
    subtitle: 'OUR RESPONSIBILITY',
  },
  {
  image: '/Slider-front.jpg',
  title: 'VISA PROCESSING',
  subtitle: 'SIMPLE. CLEAR. RELIABLE.',
},
 
];

// ===== Clean Animation Variants (No Blur, No White Haze) =====

const subtitleVariants = {
  hidden: { 
    opacity: 0, 
    y: 15, 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.7, 
      delay: 0.1, 
      ease: [0.25, 1, 0.5, 1] 
    } 
  },
};

const titleVariants = {
  hidden: { 
    opacity: 0, 
    y: 25, 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      delay: 0.2, 
      ease: [0.25, 1, 0.5, 1] 
    } 
  },
};

const buttonVariants = {
  hidden: { 
    opacity: 0, 
    y: 15, 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.7, 
      delay: 0.35, 
      ease: [0.25, 1, 0.5, 1] 
    } 
  },
};

// Module-level persistent cache: keeps GPU texture resident across route navigations
if (typeof window !== 'undefined') {
  bannerData.forEach((item) => {
    const img = new Image();
    img.src = item.image;
    if ('decode' in img) {
      img.decode().catch(() => {});
    }
  });
}

const Banner = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const isAppLoading = useSelector((state) => state.loading?.isLoading ?? false);
  const [isReady, setIsReady] = useState(!isAppLoading);

  useEffect(() => {
    if (!isAppLoading) {
      // Coordinate entrance smoothly
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isAppLoading]);

  const handleDiscoverMore = () => {
    navigate('/country');
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative select-none bg-black">
      {/* INSTANT HERO BACKDROP:
          Guarantees 0ms black screen when returning to Home from any page.
          Renders /Slider-front1.jpg immediately on frame 0 before Swiper mounts. */}
      <img
        src="/Slider-front1.jpg"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="sync"
        className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-opacity duration-1000 ${
          activeIndex === 0 ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Top Scrim for Ultimate Navbar Legibility & Luxury Feel */}
      <div 
        className="absolute top-0 left-0 right-0 h-44 md:h-56 z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.45) 45%, rgba(0, 0, 0, 0.15) 75%, rgba(0, 0, 0, 0) 100%)',
        }}
      />

      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        loop={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-white/40 !w-2.5 !h-2.5 !transition-all !duration-500',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-[#ff3c3c] !w-9 !rounded-full !shadow-[0_0_12px_rgba(255,60,60,0.6)]'
        }}
        className="relative z-10 w-full h-full bg-transparent"
      >
        {bannerData.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="h-screen w-screen flex flex-col justify-center items-center text-white text-center px-4 relative overflow-hidden bg-transparent">
              
              {/* Original Photo Background - Clean & Vibrant */}
              <motion.div
                initial={{ scale: 1 }}
                animate={(isReady && activeIndex === index) ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 7, ease: "easeOut" }}
                className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding={index === 0 ? "sync" : "async"}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  style={{
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                />
              </motion.div>

              {/* Subtitle (Eyebrow Heading) */}
              <motion.div
                initial="hidden"
                animate={(isReady && activeIndex === index) ? 'visible' : 'hidden'}
                variants={subtitleVariants}
                className="relative z-10"
              >
                <p className="font-bold text-[0.85rem] md:text-[1rem] mb-3 uppercase text-[#ff3c3c] font-['Inter'] tracking-[0.25em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {item.subtitle}
                </p>
              </motion.div>

              {/* Main Title */}
              <motion.div
                initial="hidden"
                animate={(isReady && activeIndex === index) ? 'visible' : 'hidden'}
                variants={titleVariants}
                className="relative z-10 max-w-5xl"
              >
                <h2 className="font-bold text-[2.2rem] sm:text-[3.2rem] md:text-[4.2rem] mb-10 font-['Outfit'] leading-tight tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
                  {item.title}
                </h2>
              </motion.div>

              {/* Animated Premium Liquid Morphic Button */}
            
                <button
                  onClick={handleDiscoverMore}
                  className="group relative overflow-hidden px-10 py-3.5 rounded-lg font-bold text-[13px] sm:text-[14px] tracking-[0.22em] text-white uppercase transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-none border border-white/35 hover:border-white/60 bg-white/10 hover:bg-white/20 backdrop-blur-xl"
                  style={{
                    boxShadow: 'none',
                    backdropFilter: 'blur(36px)',
                    WebkitBackdropFilter: 'blur(16px)',
                  }}
                >
                  {/* Liquid Specular Top Glare */}
                  <span
                    className="absolute inset-0 rounded-sm bg-gradient-to-b from-white/25 via-white/5 to-transparent pointer-events-none"
                    style={{ boxShadow: 'none' }}
                  />

                  {/* Fluid Liquid Light Sweep Effect */}
                  <span
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
                    style={{ boxShadow: 'none' }}
                  />

                  <span className="relative z-10 flex items-center justify-center gap-2">
                    START JOURNEY
                  </span>
                </button>
      
           
              
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Global Style for Swiper Pagination */}
      <style>
        {`
          .swiper-pagination-bullet {
            background: rgba(255,255,255,0.4) !important;
            width: 10px !important;
            height: 10px !important;
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
            opacity: 1 !important;
          }
          .swiper-pagination-bullet-active {
            background: #ff3c3c !important;
            width: 36px !important;
            border-radius: 5px !important;
            box-shadow: 0 0 12px rgba(255, 60, 60, 0.6) !important;
          }
        `}
      </style>
    </div>
  );
};

export default Banner;
