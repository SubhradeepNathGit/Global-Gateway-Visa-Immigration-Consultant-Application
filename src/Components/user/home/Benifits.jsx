import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { People, Assignment, Security } from '@mui/icons-material';

const benefits = [
  {
    icon: <People sx={{ color: '#ef4444', fontSize: 26 }} />,
    title: 'Direct Online Interviews',
    label: 'BENEFIT 01',
    cardRadius: '22px 10px 22px 14px',
    podRadius: '44% 56% 62% 38% / 54% 46% 54% 46%',
  },
  {
    icon: <Assignment sx={{ color: '#ef4444', fontSize: 26 }} />,
    title: 'Quick & Easy Process',
    label: 'BENEFIT 02',
    cardRadius: '14px 24px 12px 22px',
    podRadius: '58% 42% 46% 54% / 46% 54% 46% 54%',
  },
  {
    icon: <Security sx={{ color: '#ef4444', fontSize: 26 }} />,
    title: '99% Visa Approvals',
    label: 'BENEFIT 03',
    cardRadius: '22px 14px 24px 10px',
    podRadius: '48% 52% 58% 42% / 54% 46% 54% 46%',
  },
];

const WhyChooseUs = () => {
  return (
    <Box
      sx={{
        bgcolor: '#f8f9fa',
        py: 10,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="xl" sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6, lg: 10 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 6,
          }}
        >
          {/* LEFT SECTION */}
          <Box flex={1} sx={{ minWidth: 0 }}>
            <p className="text-xs md:text-sm font-semibold tracking-[0.15em] text-red-600 uppercase mb-1.5 font-['Inter',sans-serif]">
              / OUR BENEFITS
            </p>

            <h2 className="text-2xl sm:text-[1.8rem] md:text-[2rem] lg:text-[2.5rem] font-bold text-[#2c3e50] leading-[1.2] tracking-[-0.015em] mb-3 font-['Outfit',sans-serif]">
              The Reasons <br />
              To Choose Our Company
            </h2>

            <Typography
              sx={{
                color: '#475569',
                fontSize: { xs: '0.92rem', md: '0.98rem' },
                mb: 4,
                maxWidth: '560px',
                lineHeight: 1.65,
              }}
            >
              Empowering your global journey with certified immigration consultants, verified visa strategies, and end-to-end relocation support tailored to your success.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.12 }}
                  whileHover={{ y: -3 }}
                  style={{ willChange: 'transform' }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: benefit.cardRadius,
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.9) 100%)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1px solid rgba(226, 232, 240, 0.85)',
                      px: { xs: 2.5, sm: 3 },
                      py: 2,
                      boxShadow: 'none',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'rgba(239, 68, 68, 0.3)',
                        boxShadow: 'none',
                        '& .benefit-pod': {
                          transform: 'scale(1.05)',
                        },
                        '& .liquid-sheen': {
                          transform: 'translateX(100%)',
                        },
                      },
                    }}
                  >
                    {/* Subtle dynamic liquid refraction sheen */}
                    <Box
                      className="liquid-sheen"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.45) 50%, transparent 100%)',
                        pointerEvents: 'none',
                        transition: 'transform 0.75s ease',
                      }}
                    />

                    {/* Left icon + text group */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.2, minWidth: 0, zIndex: 1 }}>
                      <Box
                        className="benefit-pod"
                        sx={{
                          width: 50,
                          height: 50,
                          flexShrink: 0,
                          background: 'linear-gradient(140deg, #ffffff 0%, #fee2e2 55%, #fecaca 100%)',
                          borderRadius: benefit.podRadius,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'none',
                          border: '1px solid rgba(254, 202, 202, 0.7)',
                          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      >
                        {benefit.icon}
                      </Box>

                      <Box sx={{ minWidth: 0 }}>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            px: 1,
                            py: 0.2,
                            borderRadius: '999px',
                            bgcolor: 'rgba(239, 68, 68, 0.08)',
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '0.7rem',
                              color: '#dc2626',
                              fontWeight: 700,
                              letterSpacing: '0.08em',
                              lineHeight: 1.2,
                            }}
                          >
                            {benefit.label}
                          </Typography>
                        </Box>

                        <Typography
                          sx={{
                            fontSize: { xs: '1rem', sm: '1.08rem' },
                            color: '#1e293b',
                            fontWeight: 650,
                            lineHeight: 1.3,
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {benefit.title}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>

          {/* RIGHT IMAGE SECTION */}
          <Box
            flex={1}
            sx={{
              position: 'relative',
              mt: { xs: 5, md: 0 },
              textAlign: 'center',
              width: '100%',
            }}
          >
            {/* ✈ Plane Icon */}
            <motion.img
              src="/Plane-icon.png"
              alt="Plane"
              className="hidden md:block"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: -20, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                width: '150px',

                zIndex: 1,
                transform: 'rotate(-10deg)',
              }}
            />

            {/* Stamp */}
            <motion.img
              src="/Stamp2.png"
              alt="Stamp"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                position: 'absolute',
                top: '5%',
                right: '5%',
                width: '150px',
                zIndex: 2,
                transform: 'rotate(25deg)',
              }}
            />

            {/* Main Image */}
            <motion.img
              src="/Choose.png"
              alt="Happy Man"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1, ease: 'easeIn' }}
              viewport={{ once: true, amount: 0.3 }}
              style={{
                width: '100%',
                maxWidth: '550px',
                height: 'auto',
                zIndex: 3,
                margin: '0 auto',
              }}
            />

            {/* Banner Below Image */}
            <Box
              sx={{
                mt: 0,
                bgcolor: '#ef4444',
                color: 'white',
                fontWeight: 600,
                textAlign: 'center',
                py: 1.5,
                px: 2,
                fontSize: '0.875rem',

                letterSpacing: 1.5,
                maxWidth: '540px',
                mx: 'auto',
                borderRadius: '10px',
              }}
            >
              Top Rated By Customers & Immigration Firms with 100% Success Rate
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default WhyChooseUs;
