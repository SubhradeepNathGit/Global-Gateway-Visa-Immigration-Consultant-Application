import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkLoggedInUser } from '../../../../Redux/Slice/auth/checkAuthSlice';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import VisaProcessSteps from '../../../../Components/user/apply-visa/process/VisaProcessSteps';
import { decodeBase64Url, encodeBase64Url } from '../../../../util/encodeDecode/base64';
import { ArrowRight } from 'lucide-react';

const VisaProcess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isuserLoading, userAuthData } = useSelector(state => state.checkAuth);

  const { country_id } = useParams();
  const countryId = decodeBase64Url(country_id);

  useEffect(() => {
    dispatch(checkLoggedInUser())
      .catch((err) => {
        console.log('Error occurred', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      });
  }, [dispatch]);

  const handleContinueClick = () => {
    if (userAuthData) {
      navigate(`/policy/${encodeBase64Url(String(countryId))}`);
    } else {
      navigate('/authentication');
    }
  };

  return (
    <div className="w-full min-h-screen md:h-screen md:max-h-screen md:overflow-hidden bg-white flex flex-col justify-between py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto w-full h-full flex flex-col justify-between flex-1">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center pt-2"
        >
          <p className="text-[11px] font-bold text-[#e53935] uppercase tracking-[0.25em] mb-1">
            Visa Application Process
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold text-[#2c3e50] tracking-tight leading-tight">
            Get your Visa Approved in <span className="text-[#e53935]">3 Simple Steps</span>
          </h1>
          <p className="mt-1.5 text-[#6c757d] text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Our streamlined process makes applying for a visa simple, fast and completely online.
          </p>
        </motion.div>

        {/* Step Cards with Center Connecting Line */}
        <div className="my-auto py-2">
          <VisaProcessSteps />
        </div>

        {/* Prominent Continue Button / CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center gap-2.5 text-center pb-2"
        >
          <p className="text-xs text-[#6c757d]">
            Ready to begin? Review the visa policy before starting your application.
          </p>
          <button
            onClick={handleContinueClick}
            className="inline-flex items-center gap-2.5 bg-[#e53935] hover:bg-[#c62828] text-white text-sm font-bold px-8 py-3.5 rounded-md transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
          >
            Continue to Online Application Form
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default VisaProcess;
