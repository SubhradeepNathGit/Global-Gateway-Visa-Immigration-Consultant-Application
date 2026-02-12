import React from 'react'
import { CheckCircle, CreditCard, FileText, Globe, Shield } from 'lucide-react'
import { getYear } from '../../../../../util/dateFormat/dateFormatConvertion'

const VisaDetails = ({ application, visaDetails, travelHistoryDetails }) => {

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
                    Visa Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm text-gray-600">Visa Type</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application?.application_visa_details?.visa_type ?? 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Entry Type</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application?.application_visa_details?.entry_type ?? 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Duration</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application?.application_visa_details?.validity ?? 'N/A'}</p>
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-sm text-gray-600">Purpose of Visit</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application?.application_visa_details?.purpose ?? 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield size={20} className="text-blue-600" />
                    Passport Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm text-gray-600">Passport Number</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application?.application_passport?.passport_number ?? 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Issue Place</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application?.application_passport?.place_of_issue ?? 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Issue Date</label>
                        <p className="text-base font-medium text-gray-900 mt-1">
                            {new Date(application?.application_passport?.issue_date).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Expiry Date</label>
                        <p className="text-base font-medium text-gray-900 mt-1">
                            {new Date(application?.application_passport?.expiry_date).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe size={20} className="text-blue-600" />
                    Travel History
                </h3>
                <div className="space-y-3">
                    {travelHistoryDetails?.length == 0 ? 'No Data Available' : travelHistoryDetails?.map((travel, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Globe size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{travel?.country?.name ?? 'N/A'}</p>
                                    <p className="text-sm text-gray-600">{travel?.visa?.purpose ?? 'N/A'}</p>
                                </div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{getYear(travel?.approval_date)}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard size={20} className="text-blue-600" />
                    Payment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm text-gray-600">Amount</label>
                        <p className="text-base font-medium text-gray-900 mt-1">RS. {application?.application_payment?.find(payment => payment.status == "success")?.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Payment Provider</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application?.application_payment?.find(payment => payment.status == "success")?.provider ?? 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Transaction ID</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application?.application_payment?.find(payment => payment.status == "success")?.transaction_id ?? 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Status</label>
                        <p className="text-green-700 rounded text-sm font-medium mt-1">
                            <CheckCircle size={14} className='inline mb-1 mr-1' />
                            {application?.application_payment?.find(payment => payment.status == "success")?.status ?? 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VisaDetails