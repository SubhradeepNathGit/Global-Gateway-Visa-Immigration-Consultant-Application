import React from 'react';
import { Box, Grid, Typography, TextField, Button, IconButton } from '@mui/material';
import { Email, Phone, Twitter, Facebook, Pinterest, Instagram } from '@mui/icons-material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

const galleryImages = [
  '/Footer1.jpg',
  '/Footer2.jpeg',
  '/Footer3.jpeg',
  '/Footer4.jpg',
  '/Footer5.jpg',
  '/Footer6.jpg'
];

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        backgroundImage: 'linear-gradient(rgba(11, 17, 30, 0.90), rgba(11, 17, 30, 0.95)), url("/PageBanner.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        color: '#94a3b8',
        fontFamily: "'Inter', sans-serif",
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Top Newsletter Section */}
      <Box
        sx={{
          px: { xs: 3, md: 8 },
          py: 4,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <FlightTakeoffIcon sx={{ fontSize: '28px', color: '#ef4444' }} />
          <Typography
            variant="h5"
            sx={{
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '22px',
              letterSpacing: '-0.3px',
            }}
          >
            Global Gateway
          </Typography>
        </Box>

        {/* Newsletter Subscription */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: 2,
            flex: 1,
            justifyContent: { xs: 'center', sm: 'flex-end' },
            width: '100%'
          }}
        >
          <Typography
            sx={{
              color: '#e2e8f0',
              fontSize: { xs: '15px', sm: '16px' },
              fontWeight: 500,
              whiteSpace: 'nowrap'
            }}
          >
            Subscribe to Newsletter
          </Typography>
          <TextField
            placeholder="Email Address"
            size="small"
            variant="outlined"
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: '4px',
              width: { xs: '100%', sm: 220 },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { border: 'none' },
                '& input': {
                  padding: '9px 14px',
                  fontSize: '14px',
                  color: '#0f172a'
                }
              }
            }}
          />
          <Button
            variant="contained"
            disableElevation
            sx={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              textTransform: 'uppercase',
              fontWeight: 600,
              px: 3,
              py: 1.1,
              borderRadius: '4px',
              fontSize: '12px',
              letterSpacing: 0.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#dc2626'
              }
            }}
          >
            Subscribe
          </Button>
        </Box>
      </Box>

      {/* Main Footer Content */}
      <Box sx={{ px: { xs: 3, md: 8 }, py: 6 }}>
        <Grid container spacing={4} justifyContent="space-between">
          {/* Contact Section */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography
              sx={{
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '15px',
                mb: 2.5
              }}
            >
              <span style={{ color: '#ef4444' }}>/</span> Contact
            </Typography>
            <Typography sx={{ mb: 0.5, fontSize: '14px', color: '#cbd5e1', lineHeight: 1.5, fontWeight: 400 }}>
              66 Road Broklyn Street, 600
            </Typography>
            <Typography sx={{ mb: 2.5, fontSize: '14px', color: '#cbd5e1', lineHeight: 1.5, fontWeight: 400 }}>
              New York, USA
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Email sx={{ color: '#ef4444', fontSize: '16px', mr: 1 }} />
              <Typography
                component="a"
                href="mailto:needhelp@company.com"
                sx={{ fontSize: '14px', color: '#cbd5e1', textDecoration: 'none', '&:hover': { color: '#ef4444' } }}
              >
                needhelp@company.com
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ color: '#ef4444', fontSize: '16px', mr: 1 }} />
              <Typography
                component="a"
                href="tel:+926668880000"
                sx={{ fontSize: '14px', color: '#cbd5e1', textDecoration: 'none', '&:hover': { color: '#ef4444' } }}
              >
                +92 666 888 0000
              </Typography>
            </Box>
          </Grid>

          {/* Explore Section */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              sx={{ color: '#ffffff', fontWeight: 600, fontSize: '15px', mb: 2.5 }}
            >
              <span style={{ color: '#ef4444' }}>/</span> Explore
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {['About Company', 'Meet the Team', 'News & Media', 'Our Projects', 'Contact'].map((item, index) => (
                <Typography
                  key={index}
                  sx={{
                    fontSize: '14px',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    lineHeight: 1.6,
                    fontWeight: 400,
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#ffffff' }
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Visa Section */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              sx={{ color: '#ffffff', fontWeight: 600, fontSize: '15px', mb: 2.5 }}
            >
              <span style={{ color: '#ef4444' }}>/</span> Visa
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {['Students Visa', 'Business Visa', 'Family Visa', 'Travel Visa', 'Work Visa'].map((item, index) => (
                <Typography
                  key={index}
                  sx={{
                    fontSize: '14px',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    lineHeight: 1.6,
                    fontWeight: 400,
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#ffffff' }
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Services Section */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              sx={{ color: '#ffffff', fontWeight: 600, fontSize: '15px', mb: 2.5 }}
            >
              <span style={{ color: '#ef4444' }}>/</span> Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {['PR Applicants', 'Visa Consultancy', 'Travel Insurance', 'Work Permits', 'Abroad Study'].map((item, index) => (
                <Typography
                  key={index}
                  sx={{
                    fontSize: '14px',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    lineHeight: 1.6,
                    fontWeight: 400,
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#ffffff' }
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Gallery Section */}
          <Grid item xs={12} md={3}>
            <Typography
              sx={{ color: '#ffffff', fontWeight: 600, fontSize: '15px', mb: 2.5 }}
            >
              <span style={{ color: '#ef4444' }}>/</span> Gallery
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 1.2,
                maxWidth: 270
              }}
            >
              {galleryImages.map((src, index) => (
                <Box
                  key={index}
                  component="img"
                  src={src}
                  alt={`gallery-${index}`}
                  sx={{
                    width: '100%',
                    height: 56,
                    objectFit: 'cover',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'transform 0.3s ease, border-color 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.06)',
                      borderColor: '#ef4444'
                    }
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Bottom Footer */}
      <Box
        sx={{
          backgroundColor: 'rgba(7, 11, 20, 0.75)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          py: 2.5,
          px: { xs: 3, md: 8 }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          <Typography sx={{ color: '#64748b', fontSize: '13.5px', fontWeight: 400 }}>
            © Copyright Reserved by Global Gateway : Made by{' '}
            <Box
              component="a"
              href="https://github.com/SubhradeepNathGit"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#cbd5e1',
                textDecoration: 'underline',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: '#ef4444'
                }
              }}
            >
              Subhradeep Nath
            </Box>
          </Typography>

          <Box sx={{ display: 'flex', gap: 0.8 }}>
            {[Twitter, Facebook, Pinterest, Instagram].map((Icon, index) => (
              <IconButton
                key={index}
                size="small"
                sx={{
                  color: '#94a3b8',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.08)'
                  }
                }}
              >
                <Icon fontSize="small" />
              </IconButton>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
