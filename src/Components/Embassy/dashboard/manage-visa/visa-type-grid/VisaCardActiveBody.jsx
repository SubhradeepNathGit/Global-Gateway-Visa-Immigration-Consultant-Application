import React from 'react'
import { Calendar, CheckCircle, ChevronDown, ChevronUp, Clock, DoorOpen, IndianRupee } from 'lucide-react';

const VisaCardActiveBody = ({ visaDetails, expandedVisa, setExpandedVisa }) => {

    const isExpanded = expandedVisa === visaDetails?.visa_id;

    return (
        <>
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-medium">Processing</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{visaDetails?.visa_processing_time ?? 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-medium">Validity</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{visaDetails?.visa_validity ?? 'N/A'}</p>
                </div>

                <div className={`rounded-lg p-3 border ${visaDetails?.visa_fees == 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-2 mb-1">
                        <IndianRupee className={`w-4 h-4 ${visaDetails?.visa_fees == 0 ? 'text-green-600' : 'text-gray-600'}`} />
                        <span className={`text-xs font-medium ${visaDetails?.visa_fees == 0 ? 'text-green-600' : 'text-gray-600'}`}>
                            Fees {visaDetails?.visa_fees == 0 && '(FREE)'}
                        </span>
                    </div>
                    <p className={`text-sm font-bold ${visaDetails?.visa_fees == 0 ? 'text-green-700' : 'text-gray-900'}`}>
                        {visaDetails?.visa_fees == 0 ? 'No charge' : `₹${parseInt(visaDetails?.visa_fees)?.toLocaleString()}`}
                    </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <DoorOpen className="w-4 h-4" />
                        <span className="text-xs font-medium">Entry Type</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{visaDetails?.entry_type?.split(" ")?.[0] ?? 'N/A'}</p>
                </div>

            </div>

            <button
                onClick={() => setExpandedVisa(isExpanded ? null : visaDetails?.visa_id)}
                className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1"
            >
                {isExpanded ? <><ChevronUp className="w-4 h-4" />Hide</> : <><ChevronDown className="w-4 h-4" />Details</>}
            </button>

            {isExpanded && (
                <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Required Documents:</p>
                    <ul className="space-y-1">
                        {visaDetails?.visa_documents?.map((doc, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                {doc}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    )
}

export default VisaCardActiveBody