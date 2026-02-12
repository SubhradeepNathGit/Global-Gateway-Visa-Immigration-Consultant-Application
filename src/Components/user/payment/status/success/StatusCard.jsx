import React from 'react'
import { Calendar, Clock, Shield } from 'lucide-react';
import { calculateProcessingRange } from '../../../../../functions/calculateExpectedDate';

const StatusCard = ({ visaSpecification, currentDate }) => {

    const estimatedProcessingDate = calculateProcessingRange(currentDate, visaSpecification?.visa_processing_time)

    return (
        <div className="bg-yellow-600/10 border border-cyan-900/10 rounded-2xl p-6 md:p-8 mb-10 print:hidden">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Clock className="text-white" size={36} />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">What Happens Next?</h3>
                    <p className="text-base text-gray-700">
                        Your application is now under review. We will notify you via email.
                    </p>
                </div>
            </div>

            <div className="space-y-3 md:space-y-4 ml-14 pt-2">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-500/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Calendar className="text-white" size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">Review Timeline</p>
                        <p className="text-xs text-gray-600">
                            Our team will review your application within 24-48 hours.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Shield className="text-white" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">Expected Completion</p>
                        <p className="text-xs text-gray-600">
                            <span className="font-semibold">{visaSpecification?.visa_processing_time} business days</span> • Estimated by {estimatedProcessingDate?.to}
                        </p>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatusCard