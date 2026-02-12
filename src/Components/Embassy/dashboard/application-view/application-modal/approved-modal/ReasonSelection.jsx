import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const ReasonSelection = ({ selectedReasons, appointmentReasons, setSelectedReasons }) => {

    // console.log('Appointment reasons',appointmentReasons);

    const toggleReason = (reasonId) => {
        setSelectedReasons(prev => {
            if (prev.includes(reasonId)) {
                return prev.filter(id => id !== reasonId);
            } else {
                return [...prev, reasonId];
            }
        });
    };

    return (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Appointment Reason(s) <span className="text-red-500">*</span>
            </h3>
            <p className="text-sm text-gray-600 mb-4">
                Select all reasons that apply for this appointment
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {appointmentReasons.map((reason) => {
                    const isSelected = selectedReasons.includes(reason?.reason_id);

                    return (
                        <button
                            key={reason.id}
                            onClick={() => toggleReason(reason.reason_id)}
                            className={`
                                flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all
                                ${isSelected
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }
                            `}
                        >
                            <div className="mt-0.5">
                                {isSelected ? (
                                    <CheckCircle2 className="text-blue-500" size={20} />
                                ) : (
                                    <Circle className="text-gray-400" size={20} />
                                )}
                            </div>

                            <div className="flex-1">
                                <div className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                                    {reason?.type}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {reason?.description}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {selectedReasons.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">
                        Selected: {selectedReasons.length} reason{selectedReasons.length > 1 ? 's' : ''}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ReasonSelection;