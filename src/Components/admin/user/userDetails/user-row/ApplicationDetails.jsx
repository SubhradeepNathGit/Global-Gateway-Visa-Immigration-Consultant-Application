import React from 'react'
import StatusBadge from '../UserStatusBadge';
import { useVisaDetailsByApplicationId } from '../../../../../tanstack/query/getApplicationVisaDetails';
import { useApplicationPaymentsByApplicationId } from '../../../../../tanstack/query/getPaymentDetails';
import { Loader2 } from 'lucide-react';

const ApplicationDetails = ({ visa }) => {
    const { data: visaData, isLoading: isVisaDataLoading, error: isVisaDataError } = useVisaDetailsByApplicationId(visa?.id);
    const { data: paymentData, isLoading: isPaymentDataLoading, error: isPaymentDataError } = useApplicationPaymentsByApplicationId(visa?.id);
    // console.log('visa', visaData);
    // console.log('payment', paymentData);

    return (
        <div className="flex items-center justify-between p-2 rounded bg-slate-700/30">
            <div>
                <div className="text-sm text-white font-medium">{visaData?.visa_type??'N/A'}</div>
                {/* <div className="text-xs text-slate-400">{visaData?.application_id?.slice(0, 10) + '...'}</div> */}
                <div className="text-xs text-slate-400">{visaData?.application_id??'N/A'}</div>
            </div>

            <div className="text-right">
                <div className="text-sm font-semibold text-white mb-1">
                    {isPaymentDataLoading
                        ? <Loader2 className="w-4 h-4 text-white animate-spin mb-4 mx-auto" />
                        : `₹${paymentData?.[0]?.amount?.toLocaleString('en-IN') || 0}`??'N/A'}
                </div>
                <StatusBadge status={visa?.status??'N/A'} type="verify" />
            </div>
        </div>
    )
}

export default ApplicationDetails