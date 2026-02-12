import React from 'react';
import { Box, Grid, Typography, Button, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, md: 10 }, backgroundColor: '#f5f5f5' }}>
      <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center" justifyContent="center">

        {/* LEFT SIDE – IMAGE */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <Box
              sx={{
                position: 'relative',
                maxWidth: 500,
                mx: { xs: 'auto', md: 0 },
              }}
            >
              <Box sx={{ position: 'relative', borderRadius: 2 }}>
                <img
                  src="/About.jpg"
                  alt="Immigration Couple"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '12px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  }}
                />

                {/* Floating Stamp */}
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [-18, -22, -18] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '-50px',
                    width: '120px',
                    height: '120px',
                    zIndex: 10,
                    transform: 'translateY(-50%) rotate(-20deg)',
                  }}
                >
                  <img
                    src="/Stamp.png"
                    alt="Stamp"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.2))',
                    }}
                  />
                </motion.div>
              </Box>

              {/* Experience Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -35,
                  left: -30,
                  backgroundColor: '#2b82ad',
                  color: 'white',
                  px: 3,
                  py: 2.2,
                  borderRadius: 2,
                  boxShadow: '0 10px 30px rgba(43, 130, 173, 0.3)',
                  minWidth: 160,
                  zIndex: 5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: 1,
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 28, color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={700} lineHeight={1}>
                      36+
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '13px', opacity: 0.9 }}>
                      Work Experience
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Grid>

        {/* RIGHT SIDE – TEXT */}
        <Grid item xs={12} md={6}>
          <Box sx={{ pl: { md: 3 } }}>
            {/* Subtitle – No Animation */}
            <Typography
              variant="overline"
              sx={{
                color: '#6c757d',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: 1.5,
              }}
            >
              / ABOUT OUR COMPANY
            </Typography>

            {/* Heading – Bottom to Top Animation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >

              <Typography
                variant="h3"
                fontWeight={700}
                sx={{
                  mt: 2,
                  mb: 3,
                  color: '#2c3e50',
                  lineHeight: 1.2,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                }}
              >
                Award Winning Visa &<br />
                Immigration Consultency
              </Typography>
            </motion.div>

            {/* Paragraph */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: '#6c757d',
                  mb: 4,
                  lineHeight: 1.7,
                  fontSize: '16px',
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque, voluptate.
              </Typography>
            </motion.div>

            {/* Feature Block */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >


              <Box display="flex" alignItems="flex-start" sx={{ mb: 4 }}>
                <Box
                  sx={{
                    backgroundColor: '#e3f2fd',
                    borderRadius: '50%',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 3,
                  }}
                >
                  <CheckCircleIcon sx={{ color: '#1976d2', fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mb: 1.5, color: '#2c3e50', fontSize: '1.3rem' }}
                  >
                    The Best Visa Services
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#6c757d',
                      lineHeight: 1.6,
                      fontSize: '15px',
                    }}
                  >
                    There are many variations of passages of Lorem Ipsum available,
                    but the majority have suffered.
                  </Typography>
                </Box>
              </Box>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Box display="flex" alignItems="center" gap={4} flexWrap="wrap">
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: '#e53935',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      borderRadius: 1,
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      fontSize: '14px',
                      letterSpacing: 1,
                      boxShadow: '0 8px 20px rgba(229, 57, 53, 0.3)',
                      '&:hover': {
                        backgroundColor: '#d32f2f',
                        boxShadow: '0 10px 25px rgba(229, 57, 53, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => navigate('/about')}
                  >
                    EXPLORE NOW
                  </Button>
                </motion.div>

                <Box display="flex" alignItems="center" gap={2}>
                  <IconButton
                    sx={{
                      backgroundColor: '#ffebee',
                      p: 2,
                      '&:hover': {
                        backgroundColor: '#ffcdd2',
                        transform: 'scale(1.05)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <PhoneIcon sx={{ color: '#e53935', fontSize: 24 }} />
                  </IconButton>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '13px' }}>
                      Call Anytime
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{ color: '#2c3e50', fontSize: '1.1rem' }}
                    >
                      +88 ( 9800 ) 6802
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default About;
