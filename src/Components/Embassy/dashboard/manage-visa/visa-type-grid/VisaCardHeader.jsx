import React from 'react'
import { CheckCircle, GripVertical, XCircle, Lock } from 'lucide-react';

const VisaCardHeader = ({ visaDetails, visaData, Icon }) => {

    return (
        <>
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                <span className="text-xs font-medium text-gray-500">Drag to reorder</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${visaDetails?.status != "active" ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                    <Icon className={`w-6 h-6 ${visaDetails?.status != "active" ? 'text-red-600' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{visaData?.visa_type}</h3>
                    {visaDetails && (
                        <span className={`inline-flex items-center gap-1 text-xs font-medium mt-1 ${visaDetails?.status != "active" ? 'text-red-600' : 'text-green-600'
                            }`}>
                            {visaDetails?.status != "active" ? (
                                <><Lock className="w-3 h-3" />Blocked</>
                            ) : visaDetails?.status == "active" ? (
                                <><CheckCircle className="w-3 h-3" />Active</>
                            ) : (
                                <><XCircle className="w-3 h-3" />Inactive</>
                            )}
                        </span>
                    )}
                </div>
            </div >
        </>
    )
}

export default VisaCardHeader