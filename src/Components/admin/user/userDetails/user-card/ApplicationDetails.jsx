import React from 'react'
import { useVisaDetailsByApplicationId } from '../../../../../tanstack/query/getApplicationVisaDetails';
import { useApplicationPaymentsByApplicationId } from '../../../../../tanstack/query/getPaymentDetails';
import StatusBadge from '../UserStatusBadge';
import { Loader2 } from 'lucide-react';

const ApplicationDetails = ({ visa }) => {
    const { data: visaData, isLoading: isVisaDataLoading, error: isVisaDataError } = useVisaDetailsByApplicationId(visa?.id);
    const { data: paymentData, isLoading: isPaymentDataLoading, error: isPaymentDataError } = useApplicationPaymentsByApplicationId(visa?.id);
    // console.log('visa', visaData);
    // console.log('payment', paymentData);

    return (
        <div className="text-xs p-2 rounded bg-slate-700/30">
            <div className="flex justify-between items-center mb-1">
                <span className="text-white font-medium">{visaData?.visa_type}</span>
                <StatusBadge status={visa?.status} type="verify" />
            </div>
            <div className="text-slate-400">{visaData?.application_id} • {isPaymentDataLoading
                ? <Loader2 className="w-4 h-4 text-white animate-spin mb-4 mx-auto" />
                : `₹${paymentData?.[0]?.amount?.toLocaleString('en-IN') || 0}`}
            </div>
        </div>
    )
}

export default ApplicationDetails