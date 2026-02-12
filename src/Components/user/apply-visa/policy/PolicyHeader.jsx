import React from 'react'
import { Clock, Calendar, CircleCheck, IndianRupee, CircleX, CircleAlert, DoorOpen } from 'lucide-react';

const PolicyHeader = ({ currentPolicy }) => {
    // console.log('Active visa policy details', currentPolicy);

    if (!currentPolicy) return null;

    const rawStatus = currentPolicy.status?.toLowerCase();

    const normalizedStatus = rawStatus === "active" ? "active" : rawStatus === "inactive" ? "inactive" : currentPolicy.status;

    // Pick icon
    const StatusIcon = normalizedStatus === "active" ? CircleCheck : normalizedStatus === "inactive" ? CircleX : CircleAlert;

    // Pick fixed tailwind color class
    const statusColorClass = normalizedStatus === "active" ? "text-green-600" : normalizedStatus === "inactive" ? "text-red-600" : "text-yellow-500";

    const badgeColorClass = normalizedStatus === "active" ? "bg-green-600" : normalizedStatus === "inactive" ? "bg-red-600" : "bg-orange-500";

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            {/* Hero Image */}
            <div className="relative h-48 md:h-64 bg-gradient-to-r from-slate-700 to-slate-900">
                <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
                            {currentPolicy.title}
                        </h2>
                        <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto">
                            {currentPolicy.description || "Review the policy details and requirements for this visa type."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Info Grid */}
            <div className="p-4 md:p-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-2">

                    {/* Processing Time */}
                    <div className="bg-red-50 border-2 border-red-100 rounded-lg p-3 md:p-4 text-center transition-shadow">
                        <Clock className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-red-500" />
                        <p className="text-xs font-bold text-gray-600 mb-1">PROCESSING TIME</p>
                        <p className="text-sm md:text-base font-bold text-red-600">
                            {currentPolicy.processingTime}
                        </p>
                    </div>

                    {/* Validity */}
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3 md:p-4 text-center transition-shadow">
                        <Calendar className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-slate-700" />
                        <p className="text-xs font-bold text-gray-600 mb-1">VALIDITY PERIOD</p>
                        <p className="text-sm md:text-base font-bold text-slate-700">
                            {currentPolicy.validityPeriod}
                        </p>
                    </div>

                    {/* Visa type */}
                    <div className="bg-blue-50 border-2 border-blue-100 rounded-lg p-3 md:p-4 text-center transition-shadow">
                        <DoorOpen className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-blue-600" />
                        <p className="text-xs font-bold text-gray-600 mb-1">VISA TYPE</p>
                        <p className="text-sm md:text-base font-bold text-blue-600">
                            {currentPolicy.visaType}
                        </p>
                    </div>

                    {/* Fees */}
                    <div className="bg-green-50 border-2 border-green-100 rounded-lg p-3 md:p-4 text-center transition-shadow">
                        <IndianRupee className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-green-600" />
                        <p className="text-xs font-bold text-gray-600 mb-1">APPLICATION FEES</p>
                        <p className="text-sm md:text-base font-bold text-green-600">
                            {currentPolicy.fees}
                        </p>
                    </div>

                    {/* Status */}
                    <div className="bg-gray-50 border-2 border-gray-100 rounded-lg p-3 md:p-4 text-center transition-shadow">
                        <StatusIcon className={`w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 ${statusColorClass}`} />
                        <p className="text-xs font-bold text-gray-600 mb-1">POLICY STATUS</p>
                        <span className={`inline-block ${badgeColorClass} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                            {normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PolicyHeader;
