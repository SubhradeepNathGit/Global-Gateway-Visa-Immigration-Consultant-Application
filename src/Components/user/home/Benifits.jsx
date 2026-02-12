import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { People, Assignment, Security } from '@mui/icons-material';

const benefits = [
  {
    icon: <People sx={{ color: '#ef4444', fontSize: 32 }} />,
    title: 'Direct Online Interviews',
    label: 'BENEFIT 01',
  },
  {
    icon: <Assignment sx={{ color: '#ef4444', fontSize: 32 }} />,
    title: 'Quick & Easy Process',
    label: 'BENEFIT 02',
  },
  {
    icon: <Security sx={{ color: '#ef4444', fontSize: 32 }} />,
    title: '99% Visa Approvals',
    label: 'BENEFIT 03',
  },
];

const WhyChooseUs = () => {
  return (
    <Box
      sx={{
        bgcolor: '#f8f9fa',
        py: 10,
        px: 2,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          px: { xs: 2, md: 4 },
        }}
      >
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
          <Box flex={1}>
            <Typography
              sx={{
                color: '#ef4444',
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'uppercase',
                mb: 2,
                letterSpacing: 1,
              }}
            >
              / Our Benefits
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' },
                color: '#1e293b',
                lineHeight: 1.4,
                mb: 3,
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',

              }}
            >
              The Reasons to Choose <br /> Our Company
            </Typography>

            <Typography
              sx={{
                color: '#6c757d',
                fontSize: '1rem',
                mb: 4,
                maxWidth: '500px',
                lineHeight: 1.7,
              }}
            >
              Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean
              sollicitudin, lorem is simply free text quis bibendum.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {benefits.map((benefit, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'white',
                    borderRadius: '10px',
                    px: 3,
                    py: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: '#fef2f2',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    {benefit.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: 12, color: '#ef4444', fontWeight: 700 }}
                    >
                      {benefit.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '1.1rem',
                        color: '#2c3e50',
                        fontWeight: 600,
                      }}
                    >
                      {benefit.title}
                    </Typography>
                  </Box>

                </Box>
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
                fontWeight: 900,
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
      </Box>
    </Box>
  );
};

export default WhyChooseUs;
