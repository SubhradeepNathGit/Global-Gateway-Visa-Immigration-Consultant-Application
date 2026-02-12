import React, { useState, useRef } from 'react';
import { Calendar, Eye, X, Printer, Phone, MapPinned, Earth } from 'lucide-react';
import AppointmentLetter from './letter/AppointmentLetter';
import { handlePrint } from './appointmentSlip';
import { useFullCountryDetails } from '../../../tanstack/query/getCountryDetails';
import { useAppointmentReasonByReasonId } from '../../../tanstack/query/getReasonForReasonId';
import { formatDateTimeMeridianWithoutSecond } from '../../../util/dateFormat/dateFormatConvertion';
import { parseJSONSafe } from '../../../util/jsonConvertion/ConvertStringToJson';

const AppointmentsSection = ({ appointments = [], getStatusColor, getStatusIcon }) => {

  // console.log('All appointments', appointments);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedReasons, setSelectedReasons] = useState(null);
  const [selectedCountryDetails, setSelectedCountryDetails] = useState(null);
  const [showLetterModal, setShowLetterModal] = useState(false);
  const letterRef = useRef(null);

  const handleViewLetter = (appointment, countryDetails, reason) => {
    setSelectedAppointment(appointment);
    setSelectedReasons(reason);
    setSelectedCountryDetails(countryDetails);
    setShowLetterModal(true);
  };

  const handleCloseModal = () => {
    setShowLetterModal(false);
    setSelectedAppointment(null);
    setSelectedReasons(null);
    setSelectedCountryDetails(null);
  };

  if (appointments.length === 0) {
    return (
      <div className="py-12 px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
            <Calendar className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-gray-600 text-lg">No appointments available</p>
          <p className="text-gray-400 text-sm mt-1">
            Your upcoming appointments will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {appointments.map(appointment => {

          const { data: countryDetails, isLoading: isCountryLoading, error: countryError } = useFullCountryDetails(appointment?.country_id);
          // console.log(countryDetails);

          let reason = [];
          appointment?.appointment_reason?.forEach(res => {
            const { data: reasonDetails, isLoading: isReasonLoading, error: reasonError } = useAppointmentReasonByReasonId(res);
            reason.push(reasonDetails?.type)

          })
          const embassy = parseJSONSafe(appointment.embassy_location);

          return (
            <div
              key={appointment?.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {countryDetails?.name ?? 'N/A'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{reason?.join(", ") ?? 'N/A'}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        <span className="font-semibold">Application #:</span>{' '}
                        {appointment?.id || 'N/A'}
                      </span>
                      <span className="text-gray-600">
                        <span className="font-semibold">Applied:</span>{' '}
                        {new Date(appointment?.applied_at).toLocaleDateString("en-GB") || 'N/A'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">Appointment Date:</span>{' '}
                      {formatDateTimeMeridianWithoutSecond(appointment?.appointment_date) || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">Appointment Venue:</span>

                      <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2">
                        <h4 className="text-sm font-semibold text-gray-800">
                          {embassy.name}
                        </h4>

                        <p className="text-sm text-gray-600">
                          <MapPinned className='inline h-4' /> {embassy.address}
                        </p>

                        <p className="text-sm text-gray-600">
                          <Phone className='inline h-4' /> {embassy.contact_no}
                        </p>

                        {embassy.website_url && (
                          <a href={`https://${embassy.website_url}`} target="_blank" rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-900 inline-flex items-center gap-1">
                            <Earth className='inline h-4 text-gray-600' /> Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleViewLetter(appointment, countryDetails, reason)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    title="View Appointment Letter"
                  >
                    <Eye className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handlePrint(appointment, countryDetails, reason)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    title="Print Appointment Letter"
                  >
                    <Printer className="w-5 h-5 text-gray-600" />
                  </button>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {getStatusIcon(appointment.status)}
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {showLetterModal && selectedAppointment && selectedCountryDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Appointment Letter
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 p-6 glass-scrollbar">
              <AppointmentLetter
                ref={letterRef}
                appointment={selectedAppointment}
                countryDetails={selectedCountryDetails}
                reason={selectedReasons}
              />
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentsSection;