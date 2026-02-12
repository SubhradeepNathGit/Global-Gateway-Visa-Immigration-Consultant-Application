import React, { forwardRef } from 'react';
import { Plane } from 'lucide-react';
import { formatAppointmentDateTimeWithYear } from '../../../../util/dateFormat/dateFormatConvertion';
import { parseJSONSafe } from '../../../../util/jsonConvertion/ConvertStringToJson';

const AppointmentLetter = forwardRef(({ appointment, countryDetails, reason }, ref) => {
    // console.log(appointment, countryDetails, reason);

    const fullName = appointment?.application_personal_info?.first_name + " " + appointment?.application_personal_info?.last_name;

    const embassy = parseJSONSafe(appointment.embassy_location);

    const location = countryDetails?.location || {
        name: countryDetails?.name + ' Embassy',
        address: 'N/A',
        phone: 'N/A'
    };

    return (
        <div ref={ref} className="bg-white p-8 max-w-3xl mx-auto text-gray-900" style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '1.4' }}>
            {/* Header */}
            <div className="text-center mb-6 pb-4 border-b-2 border-red-800">
                <div className="w-16 h-16 border-3 border-red-800 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <div className="text-red-800 font-bold text-xs"><Plane /></div>
                </div>
                <h1 className="text-xl font-bold uppercase tracking-wide mb-1">Appointment Letter</h1>
                <p className="text-sm text-gray-700">{countryDetails?.name} Embassy - Consular Section</p>
            </div>

            {/* Reference Number */}
            <div className="mb-4 pb-3 border-b border-gray-300">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-xs text-gray-600 uppercase">Appointment ID:</span>
                        <span className="ml-2 font-bold font-mono">{appointment?.id || 'N/A'}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs text-gray-600">Visa Type: </span>
                        <span className="text-xs">{appointment?.application_visa_details?.visa_type}</span>
                    </div>
                </div>
            </div>

            {/* Applicant Details */}
            <div className="mb-4">
                <h2 className="text-sm font-bold uppercase mb-2 text-red-800">Applicant Details</h2>
                <div className="text-sm">
                    <div className="flex mb-1">
                        <span className="w-32 text-gray-600">Name:</span>
                        <span className="font-semibold">{fullName || 'N/A'}</span>
                    </div>
                    <div className="flex mb-1">
                        <span className="w-32 text-gray-600">Passport No:</span>
                        <span className="font-semibold">{appointment?.application_passport?.passport_number || 'N/A'}</span>
                    </div>
                    <div className="flex mb-1">
                        <span className="w-32 text-gray-600">Email:</span>
                        <span>{appointment?.application_personal_info?.email || 'N/A'}</span>
                    </div>
                    <div className="flex">
                        <span className="w-32 text-gray-600">Phone:</span>
                        <span>{appointment?.application_personal_info?.phone || 'N/A'}</span>
                    </div>
                </div>
            </div>

            {/* Appointment Details */}
            <div className="mb-4 bg-red-50 border-l-4 border-red-800 p-4">
                <h2 className="text-sm font-bold uppercase mb-2 text-red-800">Appointment Schedule</h2>
                <div className="text-sm">
                    <div className="flex mb-1">
                        <span className="w-24 text-gray-700 font-semibold">Date:</span>
                        <span className="font-bold">{formatAppointmentDateTimeWithYear(appointment?.appointment_date)?.date || 'N/A'}</span>
                    </div>
                    <div className="flex mb-2">
                        <span className="w-24 text-gray-700 font-semibold">Time:</span>
                        <span className="font-bold">{formatAppointmentDateTimeWithYear(appointment?.appointment_date)?.time || 'N/A'}</span>
                    </div>
                    <div className="pt-2 border-t border-red-200">
                        <p className="font-semibold mb-1">{embassy.name}</p>
                        <p className="text-xs">{embassy.address}</p>
                        <p className="text-xs">Tel: {embassy.contact_no}</p>
                    </div>
                </div>
            </div>

            {/* Purpose */}
            {reason?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase mb-2 text-red-800">Purpose</h2>
                    <div className="text-sm">
                        {reason?.map((reasonTitle, index) => (
                            <div key={reasonTitle} className="mb-1">
                                • {reasonTitle || 'N/A'}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="mb-4">
                <h2 className="text-sm font-bold uppercase mb-2 text-red-800">Important Instructions</h2>
                <div className="text-xs leading-relaxed">
                    <p className="mb-1">• Arrive 15 minutes before your appointment time</p>
                    <p className="mb-1">• Bring this printed letter and valid passport</p>
                    <p className="mb-1">• Carry all original documents with your application</p>
                    <p className="mb-1">• Electronic devices are not permitted inside</p>
                    <p className="mb-1">• Professional attire required</p>
                </div>
            </div>

            {/* Documents Required */}
            <div className="mb-4">
                <h2 className="text-sm font-bold uppercase mb-2 text-red-800">Required Documents</h2>
                <div className="text-xs grid grid-cols-2 gap-x-4">
                    <div>• Appointment letter (printed)</div>
                    <div>• Valid passport (original)</div>
                    <div>• DS-160 confirmation</div>
                    <div>• Visa fee receipt</div>
                    <div>• 2 passport photos</div>
                    <div>• Supporting documents</div>
                </div>
            </div>

            {/* Notice */}
            <div className="mb-4 p-3 bg-gray-100 border border-gray-400 text-xs italic">
                Appointment does not guarantee visa approval. Your application will be reviewed by a consular officer per U.S. immigration law.
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-gray-400 text-xs text-center text-gray-600">
                <p className="mb-1">For inquiries: consularsupport@state.gov | {location.phone}</p>
                <p className="text-xs text-gray-500">This is an official document. Please present it at your appointment.</p>
            </div>
        </div>
    );
});

AppointmentLetter.displayName = 'AppointmentLetter';

export default AppointmentLetter;