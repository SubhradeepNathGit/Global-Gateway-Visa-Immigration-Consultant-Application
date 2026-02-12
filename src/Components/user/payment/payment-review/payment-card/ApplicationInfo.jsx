import React from 'react'

const ApplicationInfo = ({ personalInfo, visaData, visaSpecification, cartItems, discount, type }) => {
    return (
        <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-5 lg:mb-5 border border-gray-300">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                {type == 'visa' ? 'Application Details' : 'Purchase Details'}
            </p>
            <div className="space-y-2">
                <div>
                    <p className="text-xs text-gray-500 mb-1">{type == 'visa' ? 'Applicant' : 'Buyer'} Email</p>
                    <p className="text-sm font-semibold text-gray-900 break-words">
                        {personalInfo?.email ?? 'N/A'}
                    </p>
                </div>
                <div className="pt-2 border-t border-gray-300">
                    <p className="text-xs text-gray-500 mb-1">{type == 'visa' ? 'Visa Type' : 'Course Count'}</p>
                    <p className="text-sm font-semibold text-gray-900">
                        {(type == 'visa' ? visaData?.visa_type : cartItems?.length) ?? 'N/A'}
                    </p>
                </div>
                <div className="pt-2 border-t border-gray-300">
                    <p className="text-xs text-gray-500 mb-1">{type == 'visa' ? 'Processing Time' : 'Promocode Avil'}</p>
                    <p className="text-sm font-semibold text-gray-900">
                        {(type == 'visa' ? visaSpecification?.visa_processing_time : Number(discount) > 0 ? 'Yes' : 'No') ?? 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ApplicationInfo