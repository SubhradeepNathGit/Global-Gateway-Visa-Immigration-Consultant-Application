import React from 'react'
import { ChevronDown, FileText } from 'lucide-react';

const RequirementsAccordion = ({expandedAccordion,handleAccordionToggle,currentPolicy}) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
                onClick={() => handleAccordionToggle('requirements')}
                className="w-full flex items-center justify-between p-4 md:p-5 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
                <span className="font-semibold text-base md:text-lg text-slate-800 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Required Documents & Eligibility Criteria
                </span>
                <ChevronDown
                    className={`w-5 h-5 transition-transform ${expandedAccordion === 'requirements' ? 'rotate-180' : ''
                        }`}
                />
            </button>
            {expandedAccordion === 'requirements' && (
                <div className="p-4 md:p-6">
                    <p className="text-gray-600 mb-4 text-sm md:text-base">
                        All applicants must provide the following documentation to ensure compliance with policy requirements:
                    </p>
                    <div className="space-y-3">
                        {currentPolicy.requirements.map((req, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                                <p className="text-sm md:text-base text-gray-700">{req}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default RequirementsAccordion