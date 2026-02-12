import React from 'react'
import { XCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updateApplicationApproveReject } from '../../../../../Redux/Slice/applicationSlice';
import getSweetAlert from '../../../../../util/alert/sweetAlert';
import hotToast from '../../../../../util/alert/hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { addNotification } from '../../../../../Redux/Slice/notificationSlice';

const RejectModal = ({ application, setShowRejectModal }) => {

    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        defaultValues: {
            reason: "",
        },
    });

    const user_notification_obj = {
        application_id: null,
        receiver_type: 'user',
        user_id: application?.user_id,
        receiver_country_id: null,
        mark_read: false
    }

    const onSubmit = (data) => {
        dispatch(updateApplicationApproveReject({ applicationId: application?.id, status: 'rejected', rejection_reason: data?.reason }))
            .then(res => {
                // console.log('Response after updating the application status', res);

                if (res.meta.requestStatus === "fulfilled") {

                    dispatch(addNotification({ ...user_notification_obj, title: `Visa application for ${application?.destinationCountry} got rejected` }))
                        .then(res => {
                            // console.log('Response after adding notification', res);

                            if (res.meta.requestStatus === "fulfilled") {

                                queryClient.invalidateQueries(["application", application?.id]);
                                hotToast(`Application rejected successfully!`, "success");
                                reset();
                                setShowRejectModal(false);
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
        <div className="bg-white border border-red-100/70 rounded-2xl shadow-2xl w-full max-w-md">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <XCircle size={24} className="text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Reject Application</h2>
                </div>
                <p className="text-gray-600 mb-4">
                    Are you sure you want to reject this application? This action cannot be undone.
                </p>
                <textarea rows={4} placeholder="Reason for rejection..."
                    {...register("reason", {
                        minLength: {
                            value: 5,
                            message: "Reason must be at least 5 characters",
                        },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 mb-2 ${errors.reason
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-red-500"
                        }`}
                />

                {errors.reason && (
                    <p className="text-sm text-red-600 mb-3">
                        {errors.reason.message}
                    </p>
                )}
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowRejectModal(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button disabled={isSubmitting}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                    >
                        Reject Application
                    </button>
                </div>
            </form>
        </div>
    )
}

export default RejectModal