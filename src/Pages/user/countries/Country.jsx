import React from 'react';
import CountryBanner from '../../../Components/user/country/CountryBanner';
import CountryList from '../../../Components/user/country/CountryList';

const CountryGrid = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top Banner */}
      <CountryBanner />

      {/* Country Cards */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:px-8 lg:px-12">
        <CountryList />
      </div>
    </div>
  );
};

export default CountryGrid;
