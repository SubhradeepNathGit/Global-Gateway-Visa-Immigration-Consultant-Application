import React from 'react'
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';
import GetStatusBadge from './GetStatusBadge';
import { formatDateDDMMYYYY, formatDateTimeMeridianWithoutSecond } from '../../../../util/dateFormat/dateFormatConvertion';
import hotToast from '../../../../util/alert/hot-toast';
import { updateApplicationApproveReject } from '../../../../Redux/Slice/applicationSlice';
import { useQueryClient } from '@tanstack/react-query';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../../Redux/Slice/notificationSlice';

const StatusCard = ({ application, setShowRejectModal, setShowAppointmentModal }) => {

    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const user_notification_obj = {
        application_id: null,
        receiver_type: 'user',
        user_id: application?.user_id,
        receiver_country_id: null,
        mark_read: false
    }

    const isWithin24HoursBeforeAppointment = (appointmentDate) => {
        if (!appointmentDate) return false;

        const now = new Date();
        const appointmentTime = new Date(appointmentDate);
        const diffMs = appointmentTime - now;

        return diffMs > 0 && diffMs <= 24 * 60 * 60 * 1000;
    };

    const isAppointmentExpired = (appointmentDate) => {
        if (!appointmentDate) return false;
        return new Date() > new Date(appointmentDate);
    };

    const isWithin24Hr = isWithin24HoursBeforeAppointment(application?.appointment_date);
    const isExpired = isAppointmentExpired(application?.appointment_date);

    const handleChangeAppointment = () => {
        if (isWithin24Hr) {
            hotToast("You cannot change the appointment within 24 hours of the scheduled time.", "error");
            return;
        }
        setShowAppointmentModal(true);
    };

    const setApplicationApprove = () => {
        dispatch(updateApplicationApproveReject({ applicationId: application?.id, status: 'approved', approval_date: new Date().toISOString() }))
            .then(res => {
                // console.log('Response after updating the application status', res);

                if (res.meta.requestStatus === "fulfilled") {

                    dispatch(addNotification({ ...user_notification_obj, title: `Congrates! Visa application for ${application?.destinationCountry} has approved successfully.` }))
                        .then(res => {
                            // console.log('Response after adding notification', res);

                            if (res.meta.requestStatus === "fulfilled") {

                                queryClient.invalidateQueries(["application", application?.id]);
                                hotToast(`Application has approved successfully!`, "success");
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
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Main Status Section */}
            <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left Side - Status and Dates */}
                    <div className="flex flex-wrap items-center gap-4">
                        {GetStatusBadge(application?.status)}

                        <div className="h-12 w-px bg-gray-300 hidden sm:block"></div>

                        <div>
                            <p className="text-sm text-gray-600">Submitted</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {formatDateDDMMYYYY(application?.applied_at)}
                            </p>
                        </div>

                        {application?.appointment_date && !application?.approval_date ? (
                            <>
                                <div className="h-12 w-px bg-gray-300 hidden sm:block"></div>
                                <div>
                                    <p className="text-sm text-gray-600">Appointment Date</p>
                                    <p className="text-lg font-semibold text-cyan-700">
                                        {formatDateTimeMeridianWithoutSecond(application?.appointment_date)}
                                    </p>
                                    {/* {application?.embassy_location && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {typeof application.embassy_location === 'string'
                                                ? application.embassy_location
                                                : application.embassy_location.address || 'N/A'}
                                        </p>
                                    )} */}
                                </div>
                            </>
                        ) : (application?.approval_date ?
                            <>
                                <div className="h-12 w-px bg-gray-300 hidden sm:block"></div>
                                <div>
                                    <p className="text-sm text-gray-600">Approval Date</p>
                                    <p className="text-lg font-semibold text-cyan-700">
                                        {formatDateTimeMeridianWithoutSecond(application?.approval_date)}
                                    </p>
                                </div>
                            </> : null
                        )}
                    </div>

                    {/* Right Side - Action Buttons */}
                    <div className="flex gap-2 shrink-0">
                        {!application?.appointment_date && application?.status === "processing" && (
                            <button
                                onClick={() => setShowRejectModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm hover:shadow cursor-pointer"
                            >
                                <XCircle size={18} />
                                Reject
                            </button>
                        )}
                        {application?.status === "processing" && !isExpired && (
                            <button
                                onClick={handleChangeAppointment}
                                className="flex items-center gap-2 px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium shadow-sm hover:shadow cursor-pointer"
                            >
                                <Calendar size={18} />
                                {!application?.appointment_date ? 'Set' : 'Change'} Appointment
                            </button>
                        )}
                        {isExpired && application?.status === "processing" && (
                            <>
                                <button
                                    onClick={() => setShowRejectModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer"
                                >
                                    <XCircle size={18} /> Reject
                                </button>

                                <button
                                    onClick={() => setApplicationApprove()}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                                >
                                    <CheckCircle2 size={18} /> Approve
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatusCard