import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import { useFullCountryDetails } from "../../../../tanstack/query/getCountryDetails";
import CountryDescription from "../../../../Components/user/country/country-details/CountryDescription";
import KeyInformation from "../../../../Components/user/country/country-details/KeyInformation";
import CountryMap from "../../../../Components/user/country/country-details/CountryMap";
import Disclaimer from "../../../../Components/user/country/country-details/Disclaimer";
import ContactInfo from "../../../../Components/user/country/country-details/ContactInfo";
import CountryCTA from "../../../../Components/user/country/country-details/CountryCTA";
import VisaListDropdown from "../../../../Components/user/country/country-details/VisaListDropdown";
import { decodeBase64Url } from "../../../../util/encodeDecode/base64";
import { useVisaDetailsByCountryAndVisitor } from "../../../../tanstack/query/getVisaDetailsViaCountryNameAndVisitorCountryId";
import { useDispatch, useSelector } from "react-redux";
import { checkLoggedInUser } from "../../../../Redux/Slice/auth/checkAuthSlice";
import getSweetAlert from "../../../../util/alert/sweetAlert";
import { Skeleton } from "@mui/material";

const CountryDetails = () => {
  const { country_id } = useParams();
  const dispatch = useDispatch();

  const countryId = decodeBase64Url(country_id);
  const { data: countryData, isLoading: countryLoading, error: countryError } = useFullCountryDetails(countryId);
  const { isuserLoading, userAuthData, userError } = useSelector(state => state.checkAuth);
  const { data: countryWiseVisaDetails = [], isLoading: isCountryWiseVisaLoading, isError } = useVisaDetailsByCountryAndVisitor(countryId, userAuthData?.country);

  useEffect(() => {
    dispatch(checkLoggedInUser())
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

  // State to check if all necessary data is loaded
  const isLoading = countryLoading || isCountryWiseVisaLoading;

  if (countryError) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl font-bold">!</span>
          </div>
          <h2 className="text-2xl font-light text-gray-900 mb-2">Unable to Load Country</h2>
          <p className="text-gray-600 mb-6">{countryError}</p>
        </div>
      </div>
    );
  }

  if (!isLoading && !countryData) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <p className="text-gray-600">Country not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-10 lg:pb-12">
      {/* Premium Back Navigation */}
      <div className="max-w-8xl mx-auto  sm:px-6 lg:px-12 pt-2 lg:pt-2">
        <Link to='/country'
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl text-gray-400 hover:text-[#FF5252] hover:border-[#FF5252]/20 transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-xs font-bold uppercase ">Back</span>
        </Link>
      </div>

      {/* Main Content Dashboard */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-0 lg:py-0"
      >

        {/* Hero Section */}
        <section className="mb-16 lg:mb-20">
          {isLoading ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton variant="text" width="150px" height={20} />
                <Skeleton variant="rectangular" width="60%" height={60} sx={{ borderRadius: '1rem' }} />
              </div>
              <Skeleton variant="rectangular" width="100%" sx={{ aspectRatio: '21/9', borderRadius: '2rem' }} />
            </div>
          ) : (
            <CountryDescription
              image_url={countryData?.image_url}
              name={countryData?.name}
              continents={countryData?.details?.continents}
              description={countryData?.description}
              flag_url={countryData?.details?.flag_url}
            />
          )}
        </section>

        {/* Split Info Section: Vital Stats & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16 lg:mb-20">
          {/* Left: Vital Statistics Grid or Skeleton */}
          {isLoading ? (
            <div className="flex flex-col h-full">
              <Skeleton variant="text" width="150px" height={24} className="mb-6" />
              <Skeleton variant="rectangular" width="100%" height={520} sx={{ borderRadius: '2rem' }} />
            </div>
          ) : (
            <KeyInformation
              officialName={countryData?.details?.official_name}
              capital={countryData?.details?.capital}
              continents={countryData?.details?.continents}
              population={countryData?.details?.population}
              currency={countryData?.details?.currency}
              languages={countryData?.details?.languages}
              available_visa={countryWiseVisaDetails}
              area={countryData?.details?.area}
            />
          )}

          {/* Right: Premium Map Integration or Skeleton */}
          {isLoading ? (
            <div className="flex flex-col h-full">
              <Skeleton variant="text" width="180px" height={24} className="mb-6" />
              <Skeleton variant="rectangular" width="100%" height={520} sx={{ borderRadius: '2rem' }} />
            </div>
          ) : (
            <CountryMap
              lat={countryData?.details?.latlng[0]}
              lng={countryData?.details?.latlng[1]}
              zoom={countryData?.details?.zoom}
              name={countryData?.name}
            />
          )}
        </div>

        {/* Bottom Detailed Sections: Sequential Flow */}
        <div className="space-y-12 mb-12">
          {/* 1. Available Visa Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-6">
              <h3 className="text-[13px] font-bold text-[#6c757d] uppercase tracking-[0.2em] whitespace-nowrap">
                / Available Visa Categories
              </h3>
            </div>
            <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-100 min-h-[140px] flex items-center transition-all duration-500">
              <div className="w-full">
                {isLoading ? (
                  <div className="flex gap-4">
                    <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: '1rem' }} />
                    <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: '1rem' }} />
                    <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: '1rem' }} />
                  </div>
                ) : (
                  <VisaListDropdown availableVisa={countryWiseVisaDetails} />
                )}
              </div>
            </div>
          </motion.div>

          {/* 2. Support & Contact Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-6">
              <h3 className="text-[13px] font-bold text-[#6c757d] uppercase tracking-[0.2em] whitespace-nowrap">
                / Support & Contact
              </h3>
            </div>
            {isLoading ? (
              <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-0 lg:divide-x lg:divide-gray-100">
                <div className="lg:px-10 xl:px-12 lg:first:pl-0"><Skeleton variant="rectangular" height={80} sx={{ borderRadius: '1.5rem' }} /></div>
                <div className="lg:px-10 xl:px-12"><Skeleton variant="rectangular" height={80} sx={{ borderRadius: '1.5rem' }} /></div>
                <div className="lg:px-10 xl:px-12 lg:last:pr-0"><Skeleton variant="rectangular" height={80} sx={{ borderRadius: '1.5rem' }} /></div>
              </div>
            ) : (
              <ContactInfo />
            )}
          </motion.div>

          {/* 3. Center Call to Action */}
          <motion.div variants={itemVariants} className="flex justify-center text-center py-4 lg:py-8">
            <div className="max-w-2xl w-full">
              {isLoading ? (
                <div className="flex flex-col items-center gap-6">
                  <Skeleton variant="rectangular" width="80%" height={60} sx={{ borderRadius: '1rem' }} />
                  <div className="flex gap-4">
                    <Skeleton variant="rectangular" width={160} height={48} sx={{ borderRadius: '0.75rem' }} />
                    <Skeleton variant="rectangular" width={160} height={48} sx={{ borderRadius: '0.75rem' }} />
                  </div>
                </div>
              ) : (
                <CountryCTA 
                    countryId={countryData?.id} 
                    countryName={countryData?.name}
                    availableVisas={countryWiseVisaDetails}
                    handleContinue={handleContinue} 
                />
              )}
            </div>
          </motion.div>
        </div>

        {/* Global Footer Disclaimer */}
        <motion.div variants={itemVariants} className="pt-8 border-t border-gray-100 opacity-60">
          {isLoading ? <Skeleton variant="text" width="100%" height={100} /> : <Disclaimer />}
        </motion.div>

      </motion.div>
    </div>
  );
};

export default CountryDetails;