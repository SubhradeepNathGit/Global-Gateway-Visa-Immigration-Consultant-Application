import React, { useState, useRef, useEffect } from 'react'
import { useFullCountryDetails } from '../../../tanstack/query/getCountryDetails'
import { useVisaDetailsByApplicationId } from '../../../tanstack/query/getApplicationVisaDetails';
import { useCountryWiseVisaDetails } from '../../../tanstack/query/getCountryWiseVisaDetails';
import { calculateProcessingRange } from '../../../functions/calculateExpectedDate';
import { X, History, Eye, Printer, FileText } from 'lucide-react';
import RejectionModal from './modal/RejectModal';
import ApprovalTimeline from './modal/ApproveModal';
import ApproveLetter from './letter/ApproveLetter';
import { handlePrintApproval } from '../../../util/printUtils';
import { useDispatch } from 'react-redux';
import { useFullApplicationDetailsById } from '../../../tanstack/query/getFullApplicationDetails';

const VisaApplicationsSection = ({ visaApplications, getStatusColor, getStatusIcon }) => {
    const dispatch = useDispatch();
    const [selectedVisa, setSelectedVisa] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [showLetterModal, setShowLetterModal] = useState(false);
    const [selectedVisaForLetter, setSelectedVisaForLetter] = useState(null);
    const [selectedCountryDetails, setSelectedCountryDetails] = useState(null);
    const [selectedApplicationDetails, setSelectedApplicationDetails] = useState(null);
    const [selectedVisaData, setSelectedVisaData] = useState(null);
    const letterRef = useRef(null);

    const openModal = (visa, type) => {
        setSelectedVisa(visa);
        setModalType(type);
    };

    const closeModal = () => {
        setSelectedVisa(null);
        setModalType(null);
    };

    const handleViewLetter = (visa, countryDetails, visaData, applicationDetails) => {
        setSelectedVisaForLetter(visa);
        setSelectedCountryDetails(countryDetails);
        setSelectedVisaData(visaData);
        setSelectedApplicationDetails(applicationDetails);
        setShowLetterModal(true);
    };

    const handleCloseLetterModal = () => {
        setShowLetterModal(false);
        setSelectedVisaForLetter(null);
        setSelectedCountryDetails(null);
        setSelectedApplicationDetails(null);
        setSelectedVisaData(null);
    };

    if (visaApplications.length === 0) {
        return (
            <div className="py-12 px-4">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
                        <FileText className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-gray-600 text-lg">No application available</p>
                    <p className="text-gray-400 text-sm mt-1">
                        Your upcoming applications will appear here
                    </p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-4">
                {visaApplications?.map(visa => {
                    const { data: visaData, isLoading: isVisaDataLoading, error: isVisaDataError } = useVisaDetailsByApplicationId(visa?.id);
                    const { data: countryWiseVisaDetails, isLoading: isCountryWiseVisaLoading, error: countryWiseVisaError } = useCountryWiseVisaDetails(visa?.country_id);
                    const { data: countryDetails, isLoading: isCountryLoading, error: countryError } = useFullCountryDetails(visa?.country_id);
                    const { data: applicationDetails, isLoading: isApplicationDetailsLoading, error: applicationDetailsError } = useFullApplicationDetailsById(visa?.id);
                    const countrySpecificVisaDetails = countryWiseVisaDetails?.find(visaType => visaType?.visa_type == visaData?.visa_type);

                    // console.log('Application details', applicationDetails);

                    const expectedDate = calculateProcessingRange(visa.applied_at, countrySpecificVisaDetails?.visa_details[0]?.visa_processing_time);

                    // Normalize status to lowercase for comparison
                    const normalizedStatus = visa.status?.toLowerCase();

                    return (
                        <div key={visa?.id} className="border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">{countryDetails?.name}</h3>
                                    <p className="text-slate-600 text-sm">{visaData?.visa_type}</p>
                                </div>
                                <div className="flex items-center gap-2">

                                    {normalizedStatus === 'approved' && (
                                        <>
                                            <button
                                                onClick={() => handleViewLetter(visa, countryDetails, visaData, applicationDetails)}
                                                className="p-1.5 rounded-full text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors flex-shrink-0 cursor-pointer"
                                                title="View Approval Letter"
                                                type="button"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handlePrintApproval(visa, countryDetails, visaData, applicationDetails)}
                                                className="p-1.5 rounded-full text-purple-600 hover:bg-purple-50 border border-purple-200 transition-colors flex-shrink-0 cursor-pointer"
                                                title="Print Approval Letter"
                                                type="button"
                                            >
                                                <Printer className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openModal(visa, 'approved')}
                                                className="p-1.5 rounded-full text-green-600 hover:bg-green-50 border border-green-200 transition-colors flex-shrink-0 cursor-pointer"
                                                title="View Timeline"
                                                type="button"
                                            >
                                                <History className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}

                                    {normalizedStatus === 'rejected' && (
                                        <button
                                            onClick={() => openModal(visa, 'rejected')}
                                            className="p-1.5 rounded-full text-red-600 hover:bg-red-50 border border-red-200 transition-colors flex-shrink-0 cursor-pointer"
                                            title="View Details"
                                            type="button"
                                        >
                                            <History className="w-4 h-4" />
                                        </button>
                                    )}

                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(visa.status)}`}>
                                        {getStatusIcon(visa.status)}
                                        {visa.status?.charAt(0).toUpperCase() + visa.status?.slice(1)}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
                                    <div><span className="font-medium text-slate-700">Application #:</span> {visa?.id}</div>
                                    {visa.applied_at && <div><span className="font-medium text-slate-700">Applied:</span> {new Date(visa.applied_at).toLocaleDateString("en-GB")}</div>}
                                    {normalizedStatus === 'processing' && expectedDate && <div><span className="font-medium text-slate-700">Expected:</span> {new Date(expectedDate?.to).toLocaleDateString("en-GB")}</div>}
                                    {visa.approval_date && <div><span className="font-medium text-slate-700">Approved:</span> {new Date(visa.approval_date).toLocaleDateString("en-GB")}</div>}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Timeline/Rejection Modal */}
            {selectedVisa && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]"
                    onClick={closeModal}
                    style={{
                        animation: 'fadeIn 0.2s ease-out'
                    }}
                >
                    <div
                        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 animate-[slideUp_0.3s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            animation: 'slideUp 0.3s ease-out'
                        }}
                    >
                        <div className="sticky top-0 bg-white/60 backdrop-blur-xl border-b border-white/30 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-slate-900">
                                {modalType === 'approved' ? 'Application Timeline' : 'Rejection Details'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-1.5 rounded-full hover:bg-white/50 transition-all duration-200 hover:scale-110"
                                type="button"
                            >
                                <X className="w-5 h-5 text-slate-700 cursor-pointer" />
                            </button>
                        </div>

                        <div className="p-6">
                            {modalType === 'rejected' ? (
                                <RejectionModal visa={selectedVisa} />
                            ) : (
                                <ApprovalTimeline visa={selectedVisa} />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Approval Letter Modal */}
            {showLetterModal && selectedVisaForLetter && selectedCountryDetails && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                Visa Approval Letter
                            </h2>
                            <button
                                onClick={handleCloseLetterModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                type="button"
                            >
                                <X className="w-5 h-5 text-gray-600 cursor-pointer" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto bg-gray-50 p-6 glass-scrollbar">
                            <ApproveLetter
                                ref={letterRef}
                                visa={selectedVisaForLetter}
                                countryDetails={selectedCountryDetails}
                                visaData={selectedVisaData}
                                applicationDetails={selectedApplicationDetails}
                            />
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={handleCloseLetterModal}
                                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                type="button"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </>
    )
}

export default VisaApplicationsSection