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
            <div className="relative">
              {/* Country Name & Continent Skeleton */}
              <div className="flex flex-col mb-4 lg:mb-6">
                <div className="flex flex-wrap items-baseline gap-3">
                  <Skeleton variant="rounded" width={220} height={46} sx={{ borderRadius: '0.75rem' }} />
                  <Skeleton variant="rounded" width={180} height={34} sx={{ borderRadius: '0.75rem' }} />
                </div>
              </div>

              {/* Hero Banner Skeleton */}
              <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] aspect-[19/9] bg-gray-200">
                <Skeleton variant="rectangular" width="100%" height="100%" sx={{ position: 'absolute', inset: 0 }} />
                
                {/* Floating Flag Badge Skeleton */}
                <div className="absolute top-8 right-8 z-10">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-white/70 p-1 shadow-2xl border-4 border-white/40 backdrop-blur-sm overflow-hidden flex items-center justify-center">
                    <Skeleton variant="circular" width="100%" height="100%" />
                  </div>
                </div>

                {/* Hero Description Overlay Skeleton */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-8 sm:p-12 pb-10">
                  <div className="flex flex-col max-w-3xl space-y-2.5">
                    <Skeleton variant="text" width={130} height={16} sx={{ bgcolor: 'rgba(255,255,255,0.4)', borderRadius: '0.25rem' }} />
                    <Skeleton variant="text" width="80%" height={26} sx={{ bgcolor: 'rgba(255,255,255,0.4)', borderRadius: '0.375rem' }} />
                    <Skeleton variant="text" width="50%" height={26} sx={{ bgcolor: 'rgba(255,255,255,0.4)', borderRadius: '0.375rem' }} />
                  </div>
                </div>
              </div>

              {/* User Interaction Badges Skeleton */}
              <div className="flex items-center gap-6 mt-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                      <Skeleton variant="circular" width={40} height={40} />
                    </div>
                  ))}
                </div>
                <Skeleton variant="text" width={240} height={20} sx={{ borderRadius: '0.25rem' }} />
              </div>
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
            <div className="h-full flex flex-col">
              <div className="flex items-center mb-6">
                <h3 className="text-[13px] font-bold text-[#6c757d] uppercase tracking-[0.2em] whitespace-nowrap">
                  / Vital Statistics
                </h3>
              </div>
              <div className="flex-1 min-h-[520px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.015)] border border-gray-100 p-6 flex flex-col justify-between overflow-hidden">
                <div className="divide-y divide-gray-50">
                  {[
                    { width: "160px" },
                    { width: "120px" },
                    { width: "130px" },
                    { width: "140px" },
                    { width: "110px" },
                    { width: "130px" },
                    { width: "150px" },
                  ].map((row, idx) => (
                    <div key={idx} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 px-4 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-[#FAFAFA] flex items-center justify-center shadow-sm">
                          <Skeleton variant="rounded" width={18} height={18} sx={{ borderRadius: '0.25rem' }} />
                        </div>
                        <Skeleton variant="text" width={90} height={14} sx={{ borderRadius: '0.25rem' }} />
                      </div>
                      <Skeleton variant="text" width={row.width} height={18} sx={{ borderRadius: '0.25rem' }} />
                    </div>
                  ))}
                </div>
              </div>
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
            <div className="h-full flex flex-col">
              <div className="flex items-center mb-6">
                <h3 className="text-[13px] font-bold text-[#6c757d] uppercase tracking-[0.2em] whitespace-nowrap">
                  / Regional Geography
                </h3>
              </div>
              <div className="flex-1 min-h-[520px] bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col relative z-10 overflow-hidden">
                <div className="relative flex-grow h-full w-full min-h-[460px] bg-[#EAE8E2] flex items-center justify-center">
                  <Skeleton variant="rectangular" width="100%" height="100%" sx={{ position: 'absolute', inset: 0 }} />
                  {/* Map marker center placeholder */}
                  <div className="relative z-10 px-5 py-3 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg flex items-center gap-3 border border-white/40">
                    <div className="w-3 h-3 rounded-full bg-[#e53935]/40 animate-ping" />
                    <Skeleton variant="text" width={120} height={16} />
                  </div>
                  {/* Zoom controls placeholder */}
                  <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 bg-white/80 p-1 rounded-xl shadow-sm border border-gray-100">
                    <Skeleton variant="rounded" width={28} height={28} sx={{ borderRadius: '0.5rem' }} />
                    <Skeleton variant="rounded" width={28} height={28} sx={{ borderRadius: '0.5rem' }} />
                  </div>
                </div>
              </div>
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
                  <div className="w-full flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shadow-sm">
                        <Skeleton variant="circular" width={22} height={22} />
                      </div>
                      <div className="space-y-1">
                        <Skeleton variant="text" width={130} height={18} sx={{ borderRadius: '0.25rem' }} />
                        <Skeleton variant="text" width={190} height={14} sx={{ borderRadius: '0.25rem' }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Skeleton variant="circular" width={22} height={22} />
                      <Skeleton variant="rounded" width={16} height={16} sx={{ borderRadius: '0.25rem' }} />
                    </div>
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
              <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-0 lg:divide-x lg:divide-gray-100">
                  {/* Phone */}
                  <div className="flex items-center gap-6 lg:px-10 xl:px-12 lg:first:pl-0">
                    <div className="w-16 h-16 rounded-2xl bg-[#FAFAFA] border border-gray-50 flex items-center justify-center shadow-sm shrink-0">
                      <Skeleton variant="rounded" width={28} height={28} sx={{ borderRadius: '0.5rem' }} />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <Skeleton variant="text" width={80} height={14} sx={{ borderRadius: '0.25rem' }} />
                      <Skeleton variant="text" width={130} height={22} sx={{ borderRadius: '0.25rem' }} />
                    </div>
                  </div>
                  {/* Email */}
                  <div className="flex items-center gap-6 lg:px-10 xl:px-12">
                    <div className="w-16 h-16 rounded-2xl bg-[#FAFAFA] border border-gray-50 flex items-center justify-center shadow-sm shrink-0">
                      <Skeleton variant="rounded" width={28} height={28} sx={{ borderRadius: '0.5rem' }} />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <Skeleton variant="text" width={70} height={14} sx={{ borderRadius: '0.25rem' }} />
                      <Skeleton variant="text" width={160} height={22} sx={{ borderRadius: '0.25rem' }} />
                    </div>
                  </div>
                  {/* Visit */}
                  <div className="flex items-center gap-6 lg:px-10 xl:px-12 lg:last:pr-0">
                    <div className="w-16 h-16 rounded-2xl bg-[#FAFAFA] border border-gray-100 flex items-center justify-center shadow-sm shrink-0">
                      <Skeleton variant="rounded" width={28} height={28} sx={{ borderRadius: '0.5rem' }} />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <Skeleton variant="text" width={60} height={14} sx={{ borderRadius: '0.25rem' }} />
                      <Skeleton variant="text" width={120} height={22} sx={{ borderRadius: '0.25rem' }} />
                    </div>
                  </div>
                </div>
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
                  <Skeleton variant="rounded" width={360} height={44} sx={{ borderRadius: '0.75rem', maxWidth: '90%' }} />
                  <div className="flex flex-wrap justify-center gap-6">
                    <Skeleton variant="rounded" width={160} height={52} sx={{ borderRadius: '0.75rem' }} />
                    <Skeleton variant="rounded" width={160} height={52} sx={{ borderRadius: '0.75rem' }} />
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
          {isLoading ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 mt-8">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Skeleton variant="circular" width={16} height={16} />
                </div>
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" width={140} height={18} sx={{ borderRadius: '0.25rem' }} />
                  <Skeleton variant="text" width="100%" height={16} sx={{ borderRadius: '0.25rem' }} />
                  <Skeleton variant="text" width="75%" height={16} sx={{ borderRadius: '0.25rem' }} />
                </div>
              </div>
            </div>
          ) : (
            <Disclaimer />
          )}
        </motion.div>

      </motion.div>
    </div>
  );
};

export default CountryDetails;