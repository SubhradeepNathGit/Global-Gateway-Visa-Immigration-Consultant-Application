import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const services = [
  {
    title: 'Student Visa',
    image: '/Student-Visa.jpg',
  },
  {
    title: 'Family Visa',
    image: '/family.jpg',
  },
  {
    title: 'Tourist Visa',
    image: '/tourist.jpg',
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
    <Box sx={{ py: 8, textAlign: 'center', bgcolor: '#ffffff' }}>
      <Container maxWidth="xl" sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6, lg: 10 } }}>
      <p className="text-xs md:text-sm font-semibold tracking-[0.15em] text-red-600 uppercase mb-1.5 font-['Inter',sans-serif]">
        / WHAT DO WE OFFER
      </p>
      <Typography
        variant="h2"
        sx={{
          fontWeight: 'bold',
          fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem', lg: '2.5rem' },
          lineHeight: 1.2,
          color: '#2c3e50',
          mb: { xs: 3, md: 4 }
        }}
      >
        Outstanding Immigration &amp; Visa Services
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
      </Container>
    </Box>
  );
};

export default VisaServicesSection;
