import React from 'react';
import CountryBanner from '../../../Components/user/country/CountryBanner';
import CountryList from '../../../Components/user/country/CountryList';
import { Container } from '@mui/material';

const CountryGrid = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top Banner */}
      <CountryBanner />

      {/* Country Cards */}
      <div className="py-6 md:py-10">
        <Container
          maxWidth="xl"
          sx={{
            maxWidth: '1400px',
            px: { xs: 2, sm: 4, md: 6, lg: 10 }
          }}
        >
          <CountryList />
        </Container>
      </div>
    </div>
  );
};

export default CountryGrid;
