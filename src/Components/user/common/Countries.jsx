import React, { useRef } from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import { motion, useInView } from 'framer-motion';

const countries = [
  { name: 'Australia',     flag: 'https://flagcdn.com/w80/au.png' },
  { name: 'United States', flag: 'https://flagcdn.com/w80/us.png' },
  { name: 'Dubai',         flag: 'https://flagcdn.com/w80/ae.png' },
  { name: 'Canada',        flag: 'https://flagcdn.com/w80/ca.png' },
  { name: 'India',         flag: 'https://flagcdn.com/w80/in.png' },
  { name: 'Turkey',        flag: 'https://flagcdn.com/w80/tr.png' },
  { name: 'Germany',       flag: 'https://flagcdn.com/w80/de.png' },
  { name: 'France',        flag: 'https://flagcdn.com/w80/fr.png' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 36 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const CountrySupportSection = () => {
  const sectionRef = useRef(null);
  const isInView   = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <Box
      ref={sectionRef}
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 6 },
        textAlign: 'center',
        bgcolor: '#fff',
      }}
    >
      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: 'red',
            mb: 1,
            fontWeight: 700,
            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          / Countries We Offer
        </Typography>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: { xs: 5, md: 7 },
            fontSize: { xs: '1.7rem', sm: '2.1rem', md: '2.6rem' },
            lineHeight: { xs: 1.3, md: 1.4 },
            color: '#111',
          }}
        >
          Countries We Support <br /> for Immigration.
        </Typography>
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <Grid container spacing={{ xs: 2, sm: 3, md: 3 }} justifyContent="center">
          {countries.map((country, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -5, transition: { duration: 0.22, ease: 'easeOut' } }}
                style={{ height: '100%', borderRadius: 12 }}
              >
                <Card
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: { xs: 2, md: 2.5 },
                    height: '100%',
                    borderRadius: '12px',
                    border: '1px solid #ebebeb',
                    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                    background: '#fff',
                    transition: 'border-color 0.25s, box-shadow 0.25s',
                    '&:hover': {
                      borderColor: '#d1d1d1',
                      boxShadow: '0 8px 28px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  {/* Flag */}
                  <Box sx={{ width: 50, height: 50, mr: 2, flexShrink: 0 }}>
                    <Avatar
                      src={country.flag}
                      alt={country.name}
                      sx={{
                        width: 50,
                        height: 50,
                        border: '1.5px solid #eee',
                      }}
                    />
                  </Box>

                  {/* Text */}
                  <CardContent sx={{ textAlign: 'left', p: 0, '&:last-child': { pb: 0 } }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: '1rem', md: '1.05rem' },
                        color: '#111',
                        lineHeight: 1.2,
                        mb: 0.3,
                      }}
                    >
                      {country.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: '0.78rem', md: '0.82rem' },
                        color: '#888',
                        lineHeight: 1.4,
                      }}
                    >
                      Visa &amp; Immigration Support
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Bottom Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.55 }}
      >
        <Box
          sx={{
            mt: { xs: 7, md: 9 },
            py: { xs: 1.5, md: 2 },
            px: { xs: 3, md: 5 },
            backgroundColor: '#f7f7f7',
            display: 'inline-block',
            borderRadius: 1,
            fontWeight: 600,
            letterSpacing: 1,
            fontSize: { xs: '11px', sm: '12px', md: '13px' },
            color: '#555',
          }}
        >
          TOP RATED BY CUSTOMERS &amp; IMMIGRATION FIRMS WITH 100% SUCCESS RATE.
        </Box>
      </motion.div>
    </Box>
  );
};

export default CountrySupportSection;
