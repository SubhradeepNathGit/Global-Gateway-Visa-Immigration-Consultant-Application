import { FileText } from 'lucide-react'
import React from 'react'

const ApplicantInfo = ({ personalInfoData, passportData, visaData, type, no_course, promocode }) => {

    return (
        <div className="bg-transparent rounded-2xl p-6 md:p-8 border border-gray-200 shadow-lg print:shadow-none print:border-0 print:border-b print:rounded-none">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="text-blue-600" size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{type == 'visa' ? 'Applicant' : 'Buyer'} Information</h3>
            </div>
            <div className="space-y-4">
                <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Full Name</p>
                    <p className="text-base font-bold text-gray-800 break-words">
                        {personalInfoData?.name || personalInfoData?.first_name + " " + personalInfoData?.last_name}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Email Address</p>
                    <p className="text-base font-semibold text-gray-800 break-words">
                        {personalInfoData?.email}
                    </p>
                </div>
                {type == 'visa' ? (
                    <>
                        <div>
                            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Passport Number</p>
                            <p className="text-base font-mono font-semibold text-gray-800">
                                {passportData?.passport_number || "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Application Type</p>
                            <p className="text-base font-semibold text-gray-800">
                                {visaData?.visa_type}
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Total Purchase Course</p>
                            <p className="text-base font-mono font-semibold text-gray-800">
                                {no_course || "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Promocode Applied</p>
                            <p className="text-base font-semibold text-gray-800">
                                {promocode ? 'Yes' : 'No'}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ApplicantInfo