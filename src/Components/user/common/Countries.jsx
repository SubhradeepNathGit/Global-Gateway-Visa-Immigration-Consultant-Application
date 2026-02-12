import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import { motion } from 'framer-motion';

const countries = [
  { name: 'Australia', flag: 'https://flagcdn.com/w80/au.png' },
  { name: 'United States', flag: 'https://flagcdn.com/w80/us.png' },
  { name: 'Dubai', flag: 'https://flagcdn.com/w80/ae.png' },
  { name: 'Canada', flag: 'https://flagcdn.com/w80/ca.png' },
  { name: 'India', flag: 'https://flagcdn.com/w80/in.png' },
  { name: 'Turkey', flag: 'https://flagcdn.com/w80/tr.png' },
  { name: 'Germany', flag: 'https://flagcdn.com/w80/de.png' },
  { name: 'France', flag: 'https://flagcdn.com/w80/fr.png' },
];

const CountrySupportSection = () => {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, md: 6 }, textAlign: 'center', bgcolor: '#fff' }}>
      {/* Subtitle */}
      <Typography
        variant="subtitle2"
        sx={{
          color: 'red',
          mb: 1,
          fontWeight: 'bold',
          fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
        }}
      >
        / COUNTRIES WE OFFER
      </Typography>

      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: { xs: 4, md: 6 },
          fontSize: { xs: '1.6rem', sm: '2rem', md: '2.5rem' },
          lineHeight: { xs: 1.3, md: 1.4 },
        }}
      >
        Countries We Support <br /> for Immigration.
      </Typography>

      {/* Country Grid */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
        {countries.map((country, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Card
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  boxShadow: 3,
                  borderRadius: 2,
                  height: '100%',
                  transition: '0.3s',
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    style={{ display: 'inline-block' }}
                  >
                    <Avatar
                      src={country.flag}
                      alt={country.name}
                      sx={{ width: 48, height: 48 }}
                    />
                  </motion.div>
                </Box>

                <CardContent sx={{ textAlign: 'left', p: 0 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', md: '1.1rem' } }}
                  >
                    {country.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, color: 'text.secondary' }}
                  >
                    Fusce pretium sem eget mattis.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Bottom Label */}
      <Box
        sx={{
          mt: { xs: 6, md: 8 },
          py: { xs: 1.5, md: 2 },
          px: { xs: 3, md: 4 },
          backgroundColor: '#f2f5f8',
          display: 'inline-block',
          borderRadius: 1,
          fontWeight: 600,
          letterSpacing: 1,
          fontSize: { xs: '12px', sm: '13px', md: '14px' },
          color: '#333',
        }}
      >
        TOP RATED BY CUSTOMERS & IMMIGRATION FIRMS WITH 100% SUCCESS RATE.
      </Box>
    </Box>
  );
};

export default CountrySupportSection;
