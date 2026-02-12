import React from 'react';
import { useSelector } from 'react-redux';

const FooterPart = ({ handleSetAppointment, selectedDate, selectedTime, selectedReasons, selectedLocation, setSelectedDate, setSelectedTime, existData }) => {
    const isValid = existData || selectedDate && selectedTime && selectedReasons && selectedReasons.length > 0 && selectedLocation;

    const { isApplicationLoading, application, isApplicationError } = useSelector(state => state.application);

    return (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
            <div className="flex items-center justify-between gap-4">
                {/* Summary */}
                <div className="flex-1">
                    {selectedDate && selectedTime && selectedReasons?.length > 0 && selectedLocation ? (
                        <div className="text-sm">
                            <p className="text-gray-600">
                                <span className="font-semibold text-gray-900">
                                    {selectedDate.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                                {' at '}
                                <span className="font-semibold text-gray-900">{selectedTime}</span>
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                                {selectedReasons.length} reason{selectedReasons.length > 1 ? 's' : ''} • {selectedLocation.city}
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">
                            {!selectedDate ? 'Select a date' : !selectedTime ? 'Select a time' : !selectedLocation ? 'Select an office location' : 'Select at least one reason'}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setSelectedDate(null);
                            setSelectedTime("");
                        }}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleSetAppointment}
                        disabled={!isValid || isApplicationLoading}
                        className={`
                            px-6 py-2 rounded-lg font-medium transition-all cursor-pointer
                            ${isValid || isApplicationLoading
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}>
                        {isApplicationLoading && (
                            <div className="w-4 h-4 border-1 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />
                        )}
                        {existData?'Reset':'Set'} Appointment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FooterPart;