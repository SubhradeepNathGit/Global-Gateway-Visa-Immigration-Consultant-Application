import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const services = [
  {
    title: 'Student Visa',
    image: '/Business2.jpg',
    icon: <SchoolIcon sx={{ color: '#fff' }} />,
  },
  {
    title: 'Family Visa',
    image: '/Family-Visa.jpg',
    icon: <GroupIcon sx={{ color: '#fff' }} />,
  },
  {
    title: 'Tourist Visa',
    image: '/Tourist-Visa.jpg',
    icon: <CameraAltIcon sx={{ color: '#fff' }} />,
  },
  {
    title: 'Resident Visa',
    image: '/Resident-Visa.jpg',
    icon: <HomeIcon sx={{ color: '#fff' }} />,
  },
  {
    title: 'Working Visa',
    image: '/Worker-Visa.jpeg',
    icon: <WorkIcon sx={{ color: '#fff' }} />,
  },
  {
    title: 'Business Visa',
    image: '/Student.jpg',
    icon: <BusinessCenterIcon sx={{ color: '#fff' }} />,
  },
];

const VisaServicesSection = () => {
  return (
    <Box sx={{ py: 8, px: 2, textAlign: 'center' }}>
      <Typography variant="subtitle2" sx={{ color: 'red', mb: 1, fontWeight: 'bold' }}>
        / WHAT DO WE OFFER
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 6 }}>
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
                  top: 16,
                  left: 16,
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: '#ff4a57',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}
              >
                {service.icon}
              </Box>

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
