import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
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
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
};

const fromBottomVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

const slideFromLeftVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8 },
  },
};

const Banner = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleDiscoverMore = () => {
    navigate('/country');
  };

  return (
    <Box sx={{ width: '100vw', overflowX: 'hidden' }}>
      <Swiper
        modules={[Autoplay, EffectCoverflow]}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        style={{ width: '100vw', height: '100vh' }}
      >
        {bannerData.map((item, index) => (
          <SwiperSlide key={index} style={{ width: '100vw' }}>
            <Box
              sx={{
                height: '100vh',
                width: '100vw',
                backgroundImage: `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                color: '#fff',
                textAlign: 'center',
                px: 2,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  zIndex: 0,
                },
              }}
            >
              {/* Title */}
              <motion.div
                initial="hidden"
                animate={activeIndex === index ? 'visible' : 'hidden'}
                variants={
                  index === 4
                    ? slideFromLeftVariants // last slide
                    : index === 3
                    ? fromBottomVariants // 4th slide
                    : titleVariants // default
                }
                style={{ zIndex: 1 }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    mb: 2,
                  }}
                >
                  {item.title}
                </Typography>
              </motion.div>

              {/* Subtitle */}
              <motion.div
                initial="hidden"
                animate={activeIndex === index ? 'visible' : 'hidden'}
                variants={
                  index === 3 ? fromBottomVariants : subtitleVariants
                }
                style={{ zIndex: 1 }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: '1.8rem', md: '3rem' },
                    mb: 4,
                  }}
                >
                  {item.subtitle}
                </Typography>
              </motion.div>

              {/* Animated Button */}
              <motion.div
                whileHover={{
                  scale: 1.1,
                 
                  transition: { type: 'spring', stiffness: 300 },
                }}
                whileTap={{ scale: 0.95 }}
                style={{ zIndex: 1 }}
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#ff3c3c',
                    color: '#fff',
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                    fontSize: '16px',
                    '&:hover': {
                      backgroundColor: '#d83434',
                    },
                  }}
                  onClick={handleDiscoverMore}
                >
                  Discover More
                </Button>
              </motion.div>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default Banner;
