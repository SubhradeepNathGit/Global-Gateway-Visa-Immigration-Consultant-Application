import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const bannerData = [
  {
    image: '/Slider5.jpg',
    title: 'APPLY FOR VISA',
    subtitle: 'IMMIGRATION',
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
    image: '/Slider8.jpg',
    title: 'YOUR DREAM JOURNEY',
    subtitle: 'OUR RESPONSIBILITY',
  },
  {
    image: '/Slider4.jpg',
    title: 'IMMIGRATION PROCESS',
    subtitle: 'STARTS HERE',
  },
];

// ===== Animation Variants =====

const titleVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } 
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, letterSpacing: '0.4em' },
  visible: { 
    opacity: 1, 
    letterSpacing: '0.25em', 
    transition: { duration: 1, delay: 0.2, ease: "easeOut" } 
  },
};

const Banner = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleDiscoverMore = () => {
    navigate('/country');
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={1500}
        loop={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-white/50 !w-2.5 !h-2.5 !transition-all',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !w-8 !rounded-full'
        }}
        className="w-full h-full"
      >
        {bannerData.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="h-screen w-screen flex flex-col justify-center items-center text-white text-center px-4 relative overflow-hidden">
              
              {/* Ken Burns Background Effect */}
              <motion.div
                initial={{ scale: 1 }}
                animate={activeIndex === index ? { scale: 1.15 } : { scale: 1 }}
                transition={{ duration: 8, ease: "linear" }}
                className="absolute inset-0 z-[-1]"
                style={{
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />

              {/* Sophisticated Gradient Overlay */}
              <div 
                className="absolute inset-0 z-0"
                style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)' }}
              />

              {/* Subtitle (Eyebrow Heading) */}
              <motion.div
                initial="hidden"
                animate={activeIndex === index ? 'visible' : 'hidden'}
                variants={subtitleVariants}
                className="relative z-10"
              >
                <p className="font-bold text-[0.8rem] md:text-[1rem] mb-2 uppercase text-[#ff3c3c] font-['Inter']">
                  {item.subtitle}
                </p>
              </motion.div>

              {/* Main Title */}
              <motion.div
                initial="hidden"
                animate={activeIndex === index ? 'visible' : 'hidden'}
                variants={titleVariants}
                className="relative z-10"
              >
                <h2 className="font-bold text-[2.2rem] md:text-[4rem] mb-10 font-['Outfit'] leading-tight [text-shadow:0_10px_30px_rgba(0,0,0,0.3)]">
                  {item.title}
                </h2>
              </motion.div>

              {/* Animated Premium Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={activeIndex === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10"
              >
                <button
                  onClick={handleDiscoverMore}
                  className="bg-[#ff3c3c] text-white px-12 py-4 rounded-full font-bold text-[15px] tracking-widest transition-all duration-300 hover:bg-[#d83434] hover:-translate-y-0.5 active:scale-95"
                >
                  START JOURNEY
                </button>
              </motion.div>

              {/* Visual Indicator of Premium 2026 feel */}
              -
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Global Style for Swiper Pagination - Custom CSS in JS fallback */}
      <style>
        {`
          .swiper-pagination-bullet {
            background: rgba(255,255,255,0.4) !important;
            width: 10px !important;
            height: 10px !important;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            opacity: 1 !important;
          }
          .swiper-pagination-bullet-active {
            background: #ff3c3c !important;
            width: 35px !important;
            border-radius: 5px !important;
          }
        `}
      </style>
    </div>
  );
};

export default Banner;
