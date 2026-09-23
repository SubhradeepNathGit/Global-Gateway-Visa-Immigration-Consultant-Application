import React from 'react';
import { Box, Grid, Typography, Button, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2.5, sm: 6, md: 8, lg: 12 },
        backgroundColor: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ maxWidth: 1360, mx: 'auto' }}>
        <Grid container spacing={{ xs: 6, lg: 7 }} alignItems="center">

          {/* LEFT SIDE – ENLARGED HERO IMAGE + STAMP + BADGE */}
          <Grid size={{ xs: 12, md: 6.2 }}>
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: { xs: '100%', sm: 600, md: 650, lg: 690 },
                  mx: { xs: 'auto', md: 0 },
                  pr: { xs: 2, sm: 3 },
                }}
              >
                {/* Decorative backdrop glow */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: -14,
                    background: 'radial-gradient(circle at 30% 30%, rgba(229, 57, 53, 0.08) 0%, transparent 70%)',
                    borderRadius: '36px',
                    filter: 'blur(24px)',
                    zIndex: 0,
                  }}
                />

                {/* Main Image Frame */}
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: '22px',
                    overflow: 'visible',
                    zIndex: 1,
                  }}
                >
                  <img
                    src="/About-new.jpg"
                    alt="Award Winning Visa and Immigration Consultancy"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      borderRadius: '22px',
                      boxShadow: '0 28px 55px -12px rgba(15, 23, 42, 0.2)',
                      border: '1px solid rgba(226, 232, 240, 0.85)',
                    }}
                  />

                  {/* Floating Stamp — Preserving original animation and graphic */}
                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [-18, -22, -18] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      top: '52%',
                      right: '-42px',
                      width: '142px',
                      height: '142px',
                      zIndex: 10,
                      transform: 'translateY(-50%) rotate(-20deg)',
                      pointerEvents: 'none',
                    }}
                  >
                    <img
                      src="/Stamp.png"
                      alt="Official Verified Stamp"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.22))',
                      }}
                    />
                  </motion.div>
                </Box>

                {/* Experience Badge — Composed & Sleek */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: { xs: -18, sm: -36 },
                    left: { xs: 8, sm: -46 },
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
                    color: 'white',
                    px: { xs: 2.5, sm: 3.2 },
                    py: 2.2,
                    borderRadius: '8px',
                    boxShadow: '0 18px 38px -6px rgba(15, 23, 42, 0.35)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    minWidth: 180,
                    zIndex: 15,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '5px',
                        p: 1.1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 28, color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700} lineHeight={1} sx={{ fontSize: '1.85rem', letterSpacing: '-0.02em' }}>
                        36+
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '12.5px', fontWeight: 500, opacity: 0.85, mt: 0.3 }}>
                        Work Experience
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Grid>

          {/* RIGHT SIDE – TEXT WITH ORIGINAL HEADING FONT & PRODUCTION-READY CONTENT */}
          <Grid size={{ xs: 12, md: 5.8 }}>
            <Box sx={{ pl: { md: 2, lg: 4 } }}>
              {/* Subtitle – Original Font */}
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

              {/* Heading – EXACT Original Font, Color (#2c3e50), Weight (700) & Size */}
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
                  Award Winning Visa &amp;<br />
                  Immigration Consultancy
                </Typography>
              </motion.div>

              {/* Lead Paragraph */}
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
                    maxWidth: 540,
                  }}
                >
                  Trusted by thousands of clients worldwide, we provide expert legal guidance, accredited immigration counsel, and dedicated end-to-end support for all your visa needs.
                </Typography>
              </motion.div>

              {/* Production-Ready Feature Highlights */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {/* Feature 1 */}
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <Box
                      sx={{
                        backgroundColor: '#e0f2fe',
                        borderRadius: '12px',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        mt: 0.5,
                      }}
                    >
                      <CheckCircleIcon sx={{ color: '#0284c7', fontSize: 22 }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ color: '#0f172a', fontSize: '1rem', mb: 0.4 }}
                      >
                        Certified Visa &amp; Immigration Specialists
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748b',
                          lineHeight: 1.6,
                          fontSize: '13.5px',
                        }}
                      >
                        Direct assistance across student, work, tourist, and permanent residency visas with a 98.4% case approval record.
                      </Typography>
                    </Box>
                  </Box>

                  {/* Feature 2 */}
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <Box
                      sx={{
                        backgroundColor: '#fef2f2',
                        borderRadius: '12px',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        mt: 0.5,
                      }}
                    >
                      <VerifiedUserIcon sx={{ color: '#e53935', fontSize: 22 }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ color: '#0f172a', fontSize: '1rem', mb: 0.4 }}
                      >
                        Fast-Track Embassy Documentation
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748b',
                          lineHeight: 1.6,
                          fontSize: '13.5px',
                        }}
                      >
                        Transparent status tracking, rapid document verification, and scheduled biometric &amp; appointment readiness.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </motion.div>

              {/* CTA Row — Explore Button + Phone Support */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Box display="flex" alignItems="center" gap={{ xs: 3, sm: 4 }} flexWrap="wrap">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                      sx={{
                        backgroundColor: '#e53935',
                        color: 'white',
                        px: 3.5,
                        py: 1.5,
                        borderRadius: '5px',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        fontSize: '13px',
                        letterSpacing: '0.08em',
                      
                        '&:hover': {
                          backgroundColor: '#d32f2f',
                          
                        },
                        transition: 'all 0.3s ease',
                      }}
                      onClick={() => navigate('/about')}
                    >
                      Explore Now
                    </Button>
                  </motion.div>

                  <Box
                    component="a"
                    href="tel:+919098786545"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.8,
                      textDecoration: 'none',
                      color: 'inherit',
                      p: 0.5,
                      borderRadius: '12px',
                      transition: 'transform 0.2s ease',
                      '&:hover': { transform: 'translateX(3px)' },
                    }}
                  >
                    <IconButton
                      component="span"
                      sx={{
                        backgroundColor: '#fee2e2',
                        p: 1.5,
                        '&:hover': {
                          backgroundColor: '#fecaca',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <PhoneIcon sx={{ color: '#e53935', fontSize: 20 }} />
                    </IconButton>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Call Anytime
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ color: '#0f172a', fontSize: '1rem', letterSpacing: '-0.01em', transition: 'color 0.2s', '&:hover': { color: '#e53935' } }}
                      >
                        +91-9098786545
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default About;
