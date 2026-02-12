import React from 'react'
import { ChevronDown, CheckCircle } from 'lucide-react';

const ApplicationProcessAccordion = ({ expandedAccordion, handleAccordionToggle }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
                onClick={() => handleAccordionToggle('process')}
                className="w-full flex items-center justify-between p-4 md:p-5 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
                <span className="font-semibold text-base md:text-lg text-slate-800 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Step-by-Step Application Process
                </span>
                <ChevronDown
                    className={`w-5 h-5 transition-transform ${expandedAccordion === 'process' ? 'rotate-180' : ''
                        }`}
                />
            </button>
            {expandedAccordion === 'process' && (
                <div className="p-4 md:p-6">
                    <p className="text-gray-600 mb-4 text-sm md:text-base">
                        Our streamlined application process ensures efficient processing while maintaining
                        the highest standards of security and compliance with international regulations.
                    </p>
                    <div className="space-y-4">
                        {[
                            'Complete comprehensive online application form with accurate information',
                            'Upload all required documents in specified formats (PDF, JPG)',
                            'Pay application fees through secure payment gateway',
                            'Schedule biometric data collection appointment (if required)',
                            'Attend mandatory interview session (if applicable)',
                            'Track application status and await final processing decision',
                        ].map((step, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                    {index + 1}
                                </div>
                                <p className="text-sm md:text-base text-gray-700 pt-1">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ApplicationProcessAccordion