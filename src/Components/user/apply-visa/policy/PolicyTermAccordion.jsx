import React from 'react'
import { ChevronDown, AlertCircle, Shield } from 'lucide-react';

const PolicyTermAccordion = ({expandedAccordion,handleAccordionToggle}) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
                onClick={() => handleAccordionToggle('terms')}
                className="w-full flex items-center justify-between p-4 md:p-5 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
                <span className="font-semibold text-base md:text-lg text-slate-800 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Policy Terms, Conditions & Legal Framework
                </span>
                <ChevronDown
                    className={`w-5 h-5 transition-transform ${expandedAccordion === 'terms' ? 'rotate-180' : ''
                        }`}
                />
            </button>
            {expandedAccordion === 'terms' && (
                <div className="p-4 md:p-6">
                    <p className="text-gray-600 mb-4 text-sm md:text-base">
                        These comprehensive policies are subject to change based on governmental regulations,
                        international agreements, and bilateral treaties. All applicants must comply with the current
                        terms and conditions at the time of application submission.
                    </p>
                    <p className="text-gray-600 mb-4 text-sm md:text-base">
                        For detailed terms and conditions, including appeal procedures, refund policies,
                        and legal obligations, please refer to our complete policy documentation or
                        contact our specialized policy department for detailed clarification.
                    </p>
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-900">
                            <strong>Important Notice:</strong> Policy compliance is mandatory for all applicants.
                            Non-compliance may result in application rejection or visa cancellation.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PolicyTermAccordion