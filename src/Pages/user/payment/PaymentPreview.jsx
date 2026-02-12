import React, { useState } from "react";
import { Lock, AlertCircle, ArrowRight, Check } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import NoticeSection from "../../../Components/user/payment/payment-review/NoticeSection";
import PaymentReviewDropdown from "../../../Components/user/payment/payment-review/PaymentReviewDropdown";
import PaymentSummaryCard from "../../../Components/user/payment/payment-review/PaymentSummaryCard";
import TrustBadges from "../../../Components/user/payment/payment-review/payment-card/TrustBadges";

const PaymentPreview = () => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleProceed = () => {
    if (!agreedToTerms) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    navigate('/payment-status', {
      state: {
        paymentDetails: state?.paymentDetails,
        personalInfoData: state?.personalInfoData,
        passportData: state?.passportData,
        visaData: state?.visaData,
        visaSpecification: state?.visaSpecification,
        country_id: state?.country_id,

        subtotal: state?.subtotal,
        total: state?.total,
        discountAmount: state?.discountAmount,
        discount: state?.discount,
        cartItems: state?.cartItems,
        cartId: state?.cartId,
        type: state?.type
      }
    })
  }

  const handleBack = () => {
    // console.log('Going back to payment details');
    navigate(state?.type == 'visa' ? `/application-form/${state?.country_id}` : '/payment');
  };

  // console.log('Received data', state);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 w-full">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
              <img
                src="/payment/paypal-logo.png"
                className="w-16 h-16 md:w-20 md:h-20 object-contain -ml-10"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold -ml-10 text-gray-900">
                Review and Confirm Payment
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 -ml-9 mt-0.5">Verify your payment details before proceeding</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Review Content - Left Side */}
          <div className="lg:col-span-2 space-y-4">
            {/* Important Notice */}
            <NoticeSection />

            {/* Payment application details  */}
            <PaymentReviewDropdown personalInfo={state?.personalInfoData} paymentMethod={state?.paymentDetails} applicationFee={state?.application_fees} visaData={state?.visaData} visaSpecification={state?.visaSpecification} serviceFee={state?.allCharges} totalAmount={state?.paymentDetails?.total_amount}
              subtotal={state?.subtotal} total={state?.total} discountAmount={state?.discountAmount} discount={state?.discount} cartItems={state?.cartItems} type={state?.type} />

            {/* Payment Summary - Mobile/Tablet Only */}
            <div className="lg:hidden">
              <PaymentSummaryCard personalInfo={state?.personalInfoData} applicationFee={state?.application_fees} serviceFee={state?.allCharges} totalAmount={state?.paymentDetails?.total_amount} visaData={state?.visaData} visaSpecification={state?.visaSpecification}
                subtotal={state?.subtotal} total={state?.total} discountAmount={state?.discountAmount} discount={state?.discount} cartItems={state?.cartItems} type={state?.type} />
            </div>

            {/* Terms Agreement */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-4 sm:p-5 md:p-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center pt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked);
                      if (e.target.checked && showError) {
                        setShowError(false);
                      }
                    }}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center bg-white transition-all peer-checked:bg-cyan-700 peer-checked:border-cyan-700 cursor-pointer">
                    {agreedToTerms && <Check size={14} className="text-white" strokeWidth={3} />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 mb-1">
                    I confirm all payment information is accurate
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    I hereby confirm that the payment details provided are correct. I agree to the{" "}
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-cyan-700 hover:underline font-medium">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-cyan-700 hover:underline font-medium">Privacy Policy</a>.
                    I understand that all fees are non-refundable once payment is processed.
                  </p>
                </div>
              </label>

              {showError && !agreedToTerms && (
                <div className="mt-4 p-3 bg-cyan-900/5 border border-cyan-700/30 rounded-lg flex items-start gap-2">
                  <AlertCircle className="text-cyan-700 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-cyan-800 font-medium">
                    Please confirm that all payment information is accurate to proceed
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 pb-4">
              <button
                type="button"
                onClick={() => handleBack()}
                className="px-4 sm:px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm sm:text-base">Back to Payment Details</span>
              </button>
              <button
                type="button"
                onClick={handleProceed}
                disabled={!agreedToTerms}
                className={`flex-1 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg focus:outline-none ${agreedToTerms
                  ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white hover:from-gray-950 hover:to-black active:scale-95 hover:shadow-xl focus:ring-2 focus:ring-cyan-700 focus:ring-offset-2 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'}`}
              >
                <Lock size={18} className="sm:w-5 sm:h-5" />
                <span>Pay ₹{Number(state?.type == 'visa' ? state?.paymentDetails?.total_amount : state?.total)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <ArrowRight size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Order Summary - Desktop Only (Right Side) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <PaymentSummaryCard personalInfo={state?.personalInfoData} applicationFee={state?.application_fees} serviceFee={state?.allCharges} totalAmount={state?.paymentDetails?.total_amount} visaData={state?.visaData} visaSpecification={state?.visaSpecification}
                subtotal={state?.subtotal} total={state?.total} discountAmount={state?.discountAmount} cartItems={state?.cartItems} discount={state?.discount} type={state?.type} />
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges Footer - Mobile/Tablet Only */}
      <div className="lg:hidden bg-white border-t border-gray-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <TrustBadges />
        </div>
      </div>
    </div>
  );
}

export default PaymentPreview;