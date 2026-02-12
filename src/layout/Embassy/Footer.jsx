import React from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton
} from '@mui/material';
import {
  Email,
  Phone,
  Twitter,
  Facebook,
  Pinterest,
  Instagram
} from '@mui/icons-material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

const galleryImages = [
  'Footer1.jpg',
  'Footer2.jpeg', 
  'Footer3.jpeg',
  'Footer4.jpg',
  'Footer5.jpg',
  'Footer6.jpg'
];

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: 'hsla(208, 41%, 15%, 1.00)', color: '#94a3b8' }}>
      {/* Top Newsletter Section */}
      <Box sx={{ 
        px: { xs: 3, md: 8 }, 
        py: 4, 
        borderBottom: '1px solid #475569',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3
      }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* <Box
            sx={{
              width: 32,
              height: 32,
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
              ✈
            </Typography>
          </Box> */}
          <FlightTakeoffIcon sx={{ fontSize: '30px', color: '#ef4444' }} />
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'white', 
              fontWeight: 'bold',
              fontSize: '24px'
            }}
          >
            Global Gateway
          </Typography>
        </Box>

        {/* Newsletter Subscription */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center', 
          gap: 2,
          flex: 1,
          justifyContent: { xs: 'center', sm: 'flex-end' },
          width: '100%'
        }}>
          <Typography 
            sx={{ 
              color: 'white',
              fontSize: { xs: '16px', sm: '18px' },
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
              backgroundColor: 'white',
              borderRadius: 1,
              width: 200,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { border: 'none' },
                '& input': {
                  padding: '10px 12px',
                  fontSize: '14px'
                }
              }
            }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#ef4444',
              color: 'white',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              px: 2.5,
              py: 1.2,
              fontSize: '12px',
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
      <Box sx={{ px: { xs: 3, md: 8 }, py: 5 }}>
        <Grid container spacing={4} justifyContent="space-between">
          {/* Contact Section */}
          <Grid item xs={12} sm={6} md={2.2}>
            <Typography 
              sx={{ 
                color: 'white', 
                fontWeight: 'bold',
                fontSize: '16px',
                mb: 2.5
              }}
            >
              <span style={{ color: '#ef4444' }}>/</span> Contact
            </Typography>
            <Typography sx={{ mb: 0.5, fontSize: '14px', lineHeight: 1.5 }}>
              66 Road Broklyn Street, 600
            </Typography>
            <Typography sx={{ mb: 2.5, fontSize: '14px', lineHeight: 1.5 }}>
              New York, USA
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Email sx={{ color: '#ef4444', fontSize: '16px', mr: 1 }} />
              <Typography sx={{ fontSize: '14px' }}>
                needhelp@company.com
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ color: '#ef4444', fontSize: '16px', mr: 1 }} />
              <Typography sx={{ fontSize: '14px' }}>
                +92 666 888 0000
              </Typography>
            </Box>
          </Grid>

          {/* Explore Section */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography 
              sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px', mb: 2.5 }}
            >
              <span style={{ color: '#ef4444' }}>/</span> Explore
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              {['About Company', 'Meet the Team', 'News & Media', 'Our Projects', 'Contact'].map((item, index) => (
                <Typography 
                  key={index}
                  sx={{ fontSize: '14px', cursor: 'pointer', lineHeight: 1.6, '&:hover': { color: '#ef4444' } }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Visa Section */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography 
              sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px', mb: 2.5 }}
            >
              <span style={{ color: '#ef4444' }}>/</span> Visa
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              {['Students Visa', 'Business Visa', 'Family Visa', 'Travel Visa', 'Work Visa'].map((item, index) => (
                <Typography 
                  key={index}
                  sx={{ fontSize: '14px', cursor: 'pointer', lineHeight: 1.6, '&:hover': { color: '#ef4444' } }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Services Section */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography 
              sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px', mb: 2.5 }}
            >
              <span style={{ color: '#ef4444' }}>/</span> Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              {['PR Applicants', 'Visa Consultancy', 'Travel Insurance', 'Work Permits', 'Abroad Study'].map((item, index) => (
                <Typography 
                  key={index}
                  sx={{ fontSize: '14px', cursor: 'pointer', lineHeight: 1.6, '&:hover': { color: '#ef4444' } }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Gallery Section */}
          <Grid item xs={12} md={3.5}>
            <Typography 
              sx={{ color: 'white', fontWeight: 'bold', fontSize: '16px', mb: 2.5 }}
            >
              <span style={{ color: '#ef4444' }}>/</span> Gallery
            </Typography>
            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              justifyContent: { xs: 'center', md: 'flex-start' },
              maxWidth: 280
            }}>
              {galleryImages.map((src, index) => (
                <Box
                  key={index}
                  component="img"
                  src={src}
                  alt={`gallery-${index}`}
                  sx={{
                    width: 85,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 1,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)'
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
          backgroundColor: 'hsla(212, 50%, 13%, 1.00)',
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
          <Typography sx={{ color: '#64748b', fontSize: '14px' }}>
            © Copyright Reserved by Global Gateway : Made by{' '}
            <Box 
              component="a" 
              href="https://github.com/SubhradeepNathGit" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ 
                color: '#64748b', 
                textDecoration: 'underline', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                '&:hover': {
                  color: '#334155'
                }
              }}
            >
              Subhradeep Nath
            </Box>
          </Typography>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {[Twitter, Facebook, Pinterest, Instagram].map((Icon, index) => (
              <IconButton 
                key={index}
                size="small"
                sx={{
                  color: 'rgba(156, 183, 222, 1)',
                  '&:hover': {
                    color: '#ef4444'
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
