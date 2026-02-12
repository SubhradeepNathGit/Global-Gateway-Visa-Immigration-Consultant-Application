import React, { useEffect, useState } from 'react'
import { Info, X } from 'lucide-react';
import CalenderPart from './approved-modal/CalenderPart';
import ClockPart from './approved-modal/ClockPart';
import FooterPart from './approved-modal/FooterPart';
import ReasonSelection from './approved-modal/ReasonSelection';
import LocationSelection from './approved-modal/LocationSelection';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { fetchSpecificationApplicationsById, updateApplicationStatus } from '../../../../../Redux/Slice/applicationSlice';
import getSweetAlert from '../../../../../util/alert/sweetAlert';
import { getDateAndTimeFromISO } from '../../../../../util/dateFormat/dateFormatConvertion';
import hotToast from '../../../../../util/alert/hot-toast';
import { fetchAppointmentReasons } from '../../../../../Redux/Slice/appointmentReasonSlice';
import { useEmbassiesAddress } from '../../../../../tanstack/query/getEmbassyAddress';
import { addNotification } from '../../../../../Redux/Slice/notificationSlice';

const AppointmentModal = ({ application, visaDetails, setShowAppointmentModal, currentCountry, setSelectedDate, setAppointmentSet, setSelectedTime, selectedDate, selectedTime, currentMonth, setCurrentMonth, embassyId, country_id }) => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const [selectedReasons, setSelectedReasons] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const { isReasonsLoading, reasonsData, hasReasonerror } = useSelector(state => state.appointmentReason);
    const { data: embassiesLocation, isLoading: isAmbessyLocationLoading, error: hasEmbassyLocationError } = useEmbassiesAddress(country_id);
    const { isApplicationLoading, application: fetchApplication, personalInfo, isApplicationError } = useSelector(state => state.application);

    // console.log('Current country', currentCountry);

    const user_notification_obj = {
        application_id: null,
        receiver_type: 'user',
        user_id: application?.user_id,
        receiver_country_id: null,
        mark_read: false
    }

    useEffect(() => {
        dispatch(fetchAppointmentReasons('active'))
            .then(res => {
                // console.log('Response for fetching appointment', res);
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchSpecificationApplicationsById(application?.id))
            .then(res => {
                // console.log('Response for fetching application', res);
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    }, [application?.id, dispatch]);

    useEffect(() => {
        const app = Array.isArray(fetchApplication) ? fetchApplication[0] : fetchApplication;

        if (app?.appointment_date) {
            const { selectedDate, selectedTime } =
                getDateAndTimeFromISO(app.appointment_date);

            setSelectedDate(selectedDate);
            setSelectedTime(selectedTime);

            setCurrentMonth(
                new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
            );
        }
    }, [fetchApplication]);

    const combineDateAndTime = (dateObj, timeStr) => {
        const [time, period] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        const combined = new Date(dateObj);
        combined.setHours(hours, minutes, 0, 0);

        return combined.toISOString();
    };

    const isSameAppointmentDate = (dateObj, timeStr, existingISO) => {
        if (!existingISO) return true;

        const newDateISO = combineDateAndTime(dateObj, timeStr);

        return (
            new Date(newDateISO).getTime() ===
            new Date(existingISO).getTime()
        );
    };

    // Calendar functions
    const handleSetAppointment = () => {
        if (selectedDate && selectedTime && selectedReasons.length > 0 && selectedLocation || fetchApplication?.[0]?.appointment_date) {
            const details = {
                date: selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                time: selectedTime,
                reasons: selectedReasons,
                location: selectedLocation,
                timestamp: new Date()
            };
            setAppointmentDetails(details);
            setAppointmentSet(true);
            setSelectedDate(null);
            setSelectedTime("");
            setSelectedReasons([]);
            setSelectedLocation(null);

            // console.log(selectedDate, selectedTime, selectedReasons, selectedLocation);

            const appointmentLocatioin = {
                name: selectedLocation?.name || selectedLocation?.country_name + " " + selectedLocation?.role?.charAt(0)?.toUpperCase() + selectedLocation?.role?.slice(1),
                address: selectedLocation?.address,
                contact_no: selectedLocation?.phone || selectedLocation?.contact_no,
                website_url: selectedLocation?.website || selectedLocation?.website_url
            }

            const existingAppointmentDate = fetchApplication?.[0]?.appointment_date;

            if (existingAppointmentDate && isSameAppointmentDate(selectedDate, selectedTime, existingAppointmentDate)) {
                setShowAppointmentModal(false);
                hotToast('Appointment date & time is already the same', 'info', <Info className='text-blue-800' />);
                return;
            }
            else {
                dispatch(updateApplicationStatus({
                    applicationId: application?.id,
                    status: 'processing',
                    appointment_date: combineDateAndTime(selectedDate, selectedTime),
                    previous_appointment_date: fetchApplication?.[0]?.appointment_date,
                    appointment_reason: fetchApplication?.[0]?.appointment_date ? fetchApplication?.[0]?.appointment_reason : selectedReasons,
                    embassy_location: fetchApplication?.[0]?.appointment_date ? fetchApplication?.[0]?.embassy_location : appointmentLocatioin,
                }))
                    .then(res => {
                        // console.log('Response for updating application', res);

                        if (res.meta.requestStatus === "fulfilled") {

                            dispatch(addNotification({ ...user_notification_obj, title: `Visa appointment for ${application?.destinationCountry} has ${existingAppointmentDate ? 're-' : ''}scheduled` }))
                                .then(res => {
                                    // console.log('Response after adding notification', res);

                                    if (res.meta.requestStatus === "fulfilled") {

                                        queryClient.invalidateQueries(["application", application?.id]);
                                        setShowAppointmentModal(false);
                                        hotToast(`Appointment has ${existingAppointmentDate ? 're-' : ''}scheduled successfully!`, "success");
                                    }
                                    else {
                                        getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                    }
                                })
                                .catch(err => {
                                    console.log('Error occured', err);
                                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                })
                        }
                        else {
                            getSweetAlert('Oops...', 'Something went wrong!', 'error');
                        }
                    })
                    .catch(err => {
                        console.log('Error occured', err);
                        getSweetAlert('Oops...', 'Something went wrong!', 'error');
                    })
            }
        } else if (selectedReasons.length === 0) {
            hotToast('Please select at least one reason for appointment', 'error');
        } else if (!selectedLocation) {
            hotToast('Please select an office location', 'error');
        }
    }

    // console.log('Fetched application details',fetchApplication?.[0]);

    if (isReasonsLoading || isAmbessyLocationLoading) {
        return (
            <div className='flex flex-col h-screen items-center justify-center bg-transparent'>
                <div className="w-12 h-12 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className='mt-5 text-blue-600'>Loading...</span>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">

            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <h2 className="text-2xl font-bold text-gray-900">Set Appointment</h2>
                <button
                    onClick={() => {
                        setShowAppointmentModal(false);
                        setSelectedDate(null);
                        setSelectedTime("");
                        setSelectedReasons([]);
                        setSelectedLocation(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X size={24} className=' cursor-pointer' />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 glass-scrollbar">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* LEFT : CALENDAR */}
                    <CalenderPart
                        currentMonth={currentMonth}
                        setCurrentMonth={setCurrentMonth}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                    />

                    {/* RIGHT : TIME */}
                    <ClockPart
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        setSelectedTime={setSelectedTime}
                        embassyId={embassyId}
                    />
                </div>

                {/* LOCATION SELECTION - Full Width */}
                <div className="mt-6">
                    {!fetchApplication?.[0]?.appointment_date &&
                        <LocationSelection
                            selectedLocation={selectedLocation}
                            setSelectedLocation={setSelectedLocation}
                            application={application}
                            visaDetails={visaDetails}
                            currentCountry={currentCountry}
                            existingLocation={embassiesLocation}
                        />
                    }
                </div>

                {/* REASON SELECTION - Full Width */}
                <div className="mt-6">
                    {!fetchApplication?.[0]?.appointment_date &&
                        <ReasonSelection
                            selectedReasons={selectedReasons}
                            appointmentReasons={reasonsData}
                            setSelectedReasons={setSelectedReasons}
                        />
                    }
                </div>
            </div>

            {/* Footer */}
            <FooterPart
                handleSetAppointment={handleSetAppointment}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedReasons={selectedReasons}
                selectedLocation={selectedLocation}
                setSelectedDate={setSelectedDate}
                setSelectedTime={setSelectedTime}
                existData={fetchApplication?.[0]?.appointment_date}
            />
        </div>
    )
}

export default AppointmentModal