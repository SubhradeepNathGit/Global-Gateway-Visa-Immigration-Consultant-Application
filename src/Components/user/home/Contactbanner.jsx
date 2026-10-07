import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import PhoneIcon from '@mui/icons-material/Phone';
import { useSnackbar } from 'notistack';

// Framer Motion variants
const ctaVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

const ContactBanner = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleCallClick = () => {
    const action = (key) => (
      <Button
        color="secondary"
        onClick={() => {
          closeSnackbar(key);
          window.location.href = 'tel:+918000123456';
        }}
      >
        📞 Call Now
      </Button>
    );

    enqueueSnackbar(
      'Visa Consultation:\n+91 80001 23456\nAvailable: Mon-Sat , 9 AM - 6 PM',
      {
        variant: 'success',
        autoHideDuration: 6000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        action
      }
    );
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
        py: { xs: 5, md: 7 }
      }}
    >
      <Container maxWidth="xl" sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6, lg: 10 } }}>
        <motion.div
          variants={ctaVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {/* Single unified box — text and number together, no gap */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              component="a"
              href="tel:+918000123456"
              onClick={handleCallClick}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 0,
                color: '#ffffff',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, opacity 0.2s ease',
                '&:hover': {
                  opacity: 0.92,
                  transform: 'scale(1.02)'
                }
              }}
            >
              <Typography
                variant="h3"
                component="span"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.1rem', lg: '2.4rem' },
                  lineHeight: 1.25,
                  fontFamily: "'Outfit', sans-serif",
                  mr: { xs: 1.5, md: 2.5 }
                }}
              >
                Are you Looking for Visa Applications? Just Call us!
              </Typography>

              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: { xs: 1, md: 1.5 } }}>
                <PhoneIcon sx={{ fontSize: { xs: 28, sm: 32, md: 38 }, color: '#ffffff' }} />
                <Typography
                  component="span"
                  sx={{
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2.15rem' },
                    letterSpacing: '0.02em',
                    whiteSpace: 'nowrap',
                    fontFamily: "'Outfit', sans-serif",
                    lineHeight: 1
                  }}
                >
                  +91 80001 23456
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ContactBanner;
