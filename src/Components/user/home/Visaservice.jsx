import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const services = [
  {
    title: 'Student Visa',
    image: '/Business2.jpg',
  },
  {
    title: 'Family Visa',
    image: '/Family-Visa.jpg',
  },
  {
    title: 'Tourist Visa',
    image: '/Tourist-Visa.jpg',
  },
  {
    title: 'Resident Visa',
    image: '/Resident-Visa.jpg',
  },
  {
    title: 'Working Visa',
    image: '/Worker-Visa.jpeg',
  },
  {
    title: 'Business Visa',
    image: '/Student.jpg',
  },
];

const VisaServicesSection = () => {
  return (
    <Box sx={{ py: 8, px: 2, textAlign: 'center', bgcolor: '#ffffff' }}>
      <Typography variant="subtitle2" sx={{ color: '#dc2626', mb: 1, fontWeight: 'bold', letterSpacing: '0.05em' }}>
        / WHAT DO WE OFFER
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 6, color: '#111827' }}>
        Outstanding Immigration <br /> Visa Services
      </Typography>

      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop
        spaceBetween={24}
        breakpoints={{
          0: { slidesPerView: 1 },
          600: { slidesPerView: 2 },
          900: { slidesPerView: 3 },
          1200: { slidesPerView: 4 },
        }}
        style={{ paddingBottom: 40 }}
      >
        {services.map((service, index) => (
          <SwiperSlide key={index}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                width: '100%',
                height: 300,
                borderRadius: 12,
                overflow: 'hidden',
                position: 'relative',
                backgroundImage: `url(${service.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer',
              }}
            >


              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 18,
                  zIndex: 2,
                }}
              >
                {service.title}
              </Box>

              {/* Hover overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 1,
                  transition: '0.3s',
                  backgroundColor: 'rgba(0,0,0,0)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.4)',
                  },
                }}
              />
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default VisaServicesSection;
