import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useFullCountryDetails } from "../../../../tanstack/query/getCountryDetails";
import CountryDescription from "../../../../Components/user/country/country-details/CountryDescription";
import KeyInformation from "../../../../Components/user/country/country-details/KeyInformation";
import CountryMap from "../../../../Components/user/country/country-details/CountryMap";
import Disclaimer from "../../../../Components/user/country/country-details/Disclaimer";
import ContactInfo from "../../../../Components/user/country/country-details/ContactInfo";
import CountryCTA from "../../../../Components/user/country/country-details/CountryCTA";
import { decodeBase64Url } from "../../../../util/encodeDecode/base64";
import { useVisaDetailsByCountryAndVisitor } from "../../../../tanstack/query/getVisaDetailsViaCountryNameAndVisitorCountryId";
import { useDispatch, useSelector } from "react-redux";
import { checkLoggedInUser } from "../../../../Redux/Slice/auth/checkAuthSlice";
import getSweetAlert from "../../../../util/alert/sweetAlert";

const CountryDetails = () => {
  const { country_id } = useParams();
  const dispatch = useDispatch();

  const countryId = decodeBase64Url(country_id);
  const { data: countryData, isLoading: countryLoading, error: countryError } = useFullCountryDetails(countryId);
  const { isuserLoading, userAuthData, userError } = useSelector(state => state.checkAuth);
  const { data: countryWiseVisaDetails = [], isLoading: isCountryWiseVisaLoading, isError } = useVisaDetailsByCountryAndVisitor(countryId, userAuthData?.country);

  // console.log("Country details", countryData);
  // console.log("Logged user data", userAuthData);
  // console.log("Country wise visa details", countryWiseVisaDetails);

  useEffect(() => {
    dispatch(checkLoggedInUser())
      .then(res => {
        // console.log('Response for fetching user profile', res);
      })
      .catch((err) => {
        console.log("Error occurred", err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      });
  }, [dispatch]);

  const handleContinue = () => {
    alert("Continue without Applying clicked - would navigate to /coachingcards");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  if (countryLoading || isCountryWiseVisaLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-18 h-18 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading country details...</p>
        </div>
      </div>
    );
  }

  if (countryError) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl font-bold">!</span>
          </div>
          <h2 className="text-2xl font-light text-gray-900 mb-2">Unable to Load Country</h2>
          <p className="text-gray-600 mb-6">{countryError}</p>
          {/* <button
            onClick={fetchCountryData}
            className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Try Again
          </button> */}
        </div>
      </div>
    );
  }

  if (!countryData) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Country not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Simple Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 lg:pt-8">
        <Link to='/country'
          className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm">Back</span>
        </Link>
      </div>

      {/* Main Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12">

        {/* Section 1: Image + Description */}
        <CountryDescription image_url={countryData?.image_url} name={countryData?.name} description={countryData?.description} flag_url={countryData?.details?.flag_url} />

        {/* Section 2: Key Information + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 lg:mb-24">

          {/* Left: Key Information */}
          <KeyInformation officialName={countryData?.details?.official_name} capital={countryData?.details?.capital} continents={countryData?.details?.continents} population={countryData?.details?.population} currency={countryData?.details?.currency} languages={countryData?.details?.languages} available_visa={countryWiseVisaDetails} area={countryData?.details?.area} />

          {/* Right: Map */}
          <CountryMap lat={countryData?.details?.latlng[0]} lng={countryData?.details?.latlng[1]} zoom={countryData?.details?.zoom} name={countryData?.name} />
        </div>

        {/* Section 3: CTA and Disclaimer */}
        <motion.div variants={itemVariants} className="pt-12 lg:pt-16">

          {/* CTA Section */}
          <CountryCTA countryId={countryData?.id} handleContinue={handleContinue} />

          <ContactInfo />

          {/* Disclaimer */}
          <Disclaimer />

        </motion.div>
      </motion.div>
    </div>
  );
};

export default CountryDetails;