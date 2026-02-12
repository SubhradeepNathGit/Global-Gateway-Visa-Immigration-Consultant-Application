import React from "react";
import PaymentDetailsCard from "./success/PaymentDetailsCard";
import ApplicantInfo from "./success/ApplicantInfo";
import StatusCard from "./success/StatusCard";
import SuccessHeader from "./success/SuccessHeader";
import SuccessFooter from "./success/SuccessFooter";
import ActionButton from "./success/ActionButton";
import Confetti from "./success/Confetti";

const PaymentSuccess = ({ type, paymentDetails, personalInfoData, currentDate, passportData, visaData, visaSpecification, handlePrintReceipt,
  handleShareStatus, showConfetti, no_course, promocode }) => {

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Confetti showConfetti={showConfetti} />

      <div className="print-receipt">
        {/* Blue Header Section - Full Width */}
        <SuccessHeader paymentDetails={paymentDetails} type={type} />

        {/* White Content Section - Full Width */}
        <div className="bg-gray-50 px-4 md:px-6 lg:px-12 py-8 md:py-12 lg:py-16 print:p-0 print:pt-4">
          <div className="max-w-6xl mx-auto">

            {/* Payment and Applicant Info Cards - Production Ready Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 print:mb-0">

              {/* Payment Details Card */}
              <PaymentDetailsCard paymentDetails={paymentDetails} currentDate={currentDate} />

              {/* Applicant Info Card */}
              <ApplicantInfo personalInfoData={personalInfoData} passportData={passportData} visaData={visaData} type={type} no_course={no_course} promocode={promocode} />
            </div>

            {/* What Happens Next Section - Hidden in Print */}
            {type == 'visa' &&
              <StatusCard visaSpecification={visaSpecification} currentDate={currentDate} />
            }

            {/* Action Buttons - Hidden in Print */}
            <ActionButton handlePrintReceipt={handlePrintReceipt} handleShareStatus={handleShareStatus} />

            {/* Footer Contact Info */}
            <SuccessFooter />
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes confetti {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }

        /* Print Stylesheet for Receipt */
        @media print {
          /* Hide everything first */
          body * {
            visibility: hidden;
            overflow: hidden !important;
          }
          /* Show only the print-receipt container */
          .print-receipt, .print-receipt * {
            visibility: visible;
          }
          .print-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
          }
          /* Ensure header colors are visible but not overly dark */
          .print\\:text-white { color: #fff !important; }
          .print\\:bg-none { background: none !important; }
          .print\\:text-gray-900 { color: #1f2937 !important; }
          .print\\:text-gray-600 { color: #4b5563 !important; }

          /* Enforce single page flow */
          .print-receipt > div {
            break-after: auto !important;
          }
          
          /* Hide non-essential sections explicitly */
          .print\\:hidden {
            display: none !important;
          }
          
          /* Override Tailwind for clean layout on print */
          .print-receipt .max-w-6xl {
              max-width: 100% !important;
              margin: 0 !important;
          }
          .print-receipt .grid {
            display: block; /* Stack elements vertically */
          }
          .print-receipt .md\\:grid-cols-2 {
            display: block;
          }
          .print-receipt .md\\:p-8 {
            padding: 1.5rem !important; /* Standardize padding */
          }
          .print-receipt .shadow-xl {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default PaymentSuccess