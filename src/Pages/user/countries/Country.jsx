import React from 'react';
import { Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CountryBanner from '../../../Components/user/country/CountryBanner';
import CountryList from '../../../Components/user/country/CountryList';

const CountryGrid = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Top Banner */}
      <CountryBanner />

      {/* Country Cards */}
      <Container maxWidth={false} sx={{ py: 8 }}>
        <CountryList />

      </Container>
    </Box>
  );
};

export default CountryGrid;
