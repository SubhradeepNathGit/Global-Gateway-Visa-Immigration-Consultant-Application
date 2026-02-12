import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

const testimonials = [
  {
    name: 'Kevin Martin',
    role: 'Customer',
    text: `I was very impressed by the company service. Lorem ipsum is simply free text used by copy typing refreshing. Neque porro est.`,
    image: '/Dp.jpg',
  },
  {
    name: 'Sarah Thompson',
    role: 'Client',
    text: `Exceptional support and service from the entire team. Truly exceeded my expectations. Their dedication is unmatched!`,
    image: '/Dp2.jpg',
  },
  {
    name: 'James Carter',
    role: 'Business Owner',
    text: `Their professionalism and quality of work are commendable. I will definitely recommend them to my network.`,
    image: '/Dp3.jpg',
  },
  {
    name: 'Alicia Gomez',
    role: 'Partner',
    text: `Collaborating with this company was smooth and efficient. Their attention to detail made a huge difference.`,
    image: '/Dp.jpg',
  },
  {
    name: 'Daniel Lee',
    role: 'Entrepreneur',
    text: `Fantastic experience overall! Their innovation and creativity gave our project a whole new life.`,
    image: '/Dp2.jpg',
  },
];

const Testimonials = () => {
  return (
    <Box
      sx={{
        backgroundImage: `url("/Bagroundimg.png")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: 10,
        px: 2,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '1200px' }}>
        {/* Section Heading */}
        <Typography
          sx={{
            color: '#ef4444',
            fontSize: '14px',
            fontWeight: 600,
            textTransform: 'uppercase',
            mb: 1,
            letterSpacing: 1,
          }}
        >
          / Our Testimonials
        </Typography>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '2.8rem' },
            color: '#1e293b',
            lineHeight: 1.2,
            mb: 5,
           
          }}
        >
          What They are <br /> Talking About Us
        </Typography>

        {/* Swiper Section */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 2,
                  boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
                  p: 4,
                  pb: 8, // Add space to accommodate Avatar
                  position: 'relative',
                  height: '100%',
                }}
              >
                <Typography
                  sx={{
                    color: '#2c3e50',
                    fontSize: '1rem',
                    lineHeight: 1.8,
                    mb: 3,
                  }}
                >
                  {testimonial.text}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: '#1e293b',
                  }}
                >
                  {testimonial.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.9rem',
                    color: '#ef4444',
                  }}
                >
                  {testimonial.role}
                </Typography>

                {/* Fixed Avatar Position */}
                <Avatar
                  src={testimonial.image}
                  alt={testimonial.name}
                  sx={{
                    width: 64,
                    height: 64,
                    border: '4px solid white',
                    position: 'absolute',
                    bottom: 16, // lifted above the edge
                    right: 32,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  }}
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

export default Testimonials;
