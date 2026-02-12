import React, { useEffect } from "react";
import OrderSummary from "./payment-interface/OrderSummary";
import PaymentForm from "./../../common/payment/PaymentForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchCharges } from "../../../../Redux/Slice/chargesSlice";
import getSweetAlert from "../../../../util/alert/sweetAlert";
import { useVisaDetailsByApplicationId } from "../../../../tanstack/query/getApplicationVisaDetails";
import { Loader2 } from "lucide-react";
import { usePersonalInfoByApplicationId } from "../../../../tanstack/query/getApplicationPersonalInfo";
import { useParams } from "react-router-dom";
import { usePassportByApplicationId } from "../../../../tanstack/query/getApplicationPassportDetails";

export default function Payment({ onBack, countryWiseVisaDetails, application_id, applicationDetails }) {
  const { country_id } = useParams();
  const dispatch = useDispatch();

  const { isChargesLoading, allCharges, hasChargesError } = useSelector(state => state.charge);
  const { data: personalInfoData, isLoading: isApplicationDataLoading, error: isApplicationSDataError } = usePersonalInfoByApplicationId(application_id);
  const { data: visaData, isLoading: isVisaDataLoading, error: isVisaDataError } = useVisaDetailsByApplicationId(application_id);
  const { data: passportData, isLoading: isPassportDataLoading, error: isPassportDataError } = usePassportByApplicationId(application_id);

  const application_fees = Number(countryWiseVisaDetails?.find(visa => visa?.id == visaData?.visaId)?.visa_fees);
  const totalCharge = Number(allCharges?.visa?.reduce((sum, charge) => sum + Number(charge.amount), 0).toFixed(2));
  const total_amount = (application_fees + totalCharge).toFixed(2);

  const visaTypeSpecification = countryWiseVisaDetails?.find(visa => visa?.id == visaData?.visaId);

  // console.log('Visa data retrive', visaData);
  // console.log('All visa details', countryWiseVisaDetails);
  // console.log('Specific visa details', visaTypeSpecification);
  // console.log('Application fees', application_fees);
  // console.log('Application total charge', totalCharge);
  // console.log('All charges', allCharges?.visa);
  // console.log('User Information', personalInfoData);
  // console.log('Application details in payment interface',applicationDetails);


  useEffect(() => {
    dispatch(fetchCharges({ type: 'visa', status: true }))
      .then(res => {
        // console.log('Response for fetching all charges for visa', res);
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }, [dispatch]);

  if (isChargesLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-18 h-18 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Processing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-white lg:h-screen lg:overflow-hidden">
      <div className="flex flex-col lg:h-full lg:grid lg:grid-cols-2">

        {/* Left Panel - Order Summary */}
        <OrderSummary onBack={onBack} allCharges={allCharges?.visa} visaData={visaData} visaSpecification={visaTypeSpecification} application_fees={application_fees} total_amount={total_amount} />

        {/* Right Panel - Payment Form */}
        <PaymentForm type={'visa'} personalInfoData={personalInfoData} allCharges={allCharges?.visa} visaData={visaData} visaSpecification={visaTypeSpecification} application_fees={application_fees} total_amount={total_amount} application_id={application_id} country_id={country_id} passportData={passportData} />

      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}