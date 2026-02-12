import React, { useEffect } from 'react'
import { Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import hotToast from '../../../../util/alert/hot-toast';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import { addAppointmentReason, fetchAppointmentReasons, updateAppointmentReason } from '../../../../Redux/Slice/appointmentReasonSlice';

const AppointmentTopicModal = ({ Modal, isModalOpen, allReasonsData, setIsModalOpen, appointmentTopic }) => {

    const dispatch = useDispatch();
    const { isReasonsLoading, reasonsData, hasReasonerror } = useSelector(state => state?.appointmentReason);
    const Icon = isReasonsLoading ? Loader2 : Check;

    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            reason_description: '',
        }
    });

    useEffect(() => {
        if (appointmentTopic) {
            reset({
                title: appointmentTopic?.type || '',
                reason_description: appointmentTopic?.description || '',
            });
        }
    }, [appointmentTopic, reasonsData, reset]);

    const handleCloseModal = () => {
        reset({ title: '', reason_description: '' });
        setIsModalOpen(false);
    };

    const onSubmit = (data) => {
        // console.log('Received data', data);

        const title = data?.title?.charAt(0)?.toUpperCase() + data?.title?.slice(1)?.toLowerCase();

        const isDuplicate = allReasonsData?.some(
            p => p?.type?.toLowerCase() === title?.toLowerCase() && p?.id !== appointmentTopic?.id
        );

        if (isDuplicate) {
            setError('title', {
                type: 'manual',
                message: 'This title already exists',
            });
            return;
        }

        try {
            const newTitleData = {
                reason_id: data?.title?.toLowerCase()?.split(" ").join("-"),
                type: title,
                description: data?.reason_description,
                status: false
            }

            dispatch(appointmentTopic ? updateAppointmentReason({
                id: appointmentTopic?.id,
                updatedData: {
                    type: title,
                    description: data?.reason_description,
                    status: appointmentTopic?.status
                }
            }) : addAppointmentReason({ newTitleData }))
                .then(res => {
                    // console.log('Response for adding reasonsData', res);

                    if (res.meta.requestStatus === "fulfilled") {
                        reset({ title: '', reason_description: '' });
                        handleCloseModal(false);
                        hotToast(`${appointmentTopic ? 'Appointment reason updated' : 'New appointment reason added'} successfully`, "success");
                        dispatch(fetchAppointmentReasons());
                    }
                    else {
                        getSweetAlert('Oops...', 'Something went wrong!', 'error');
                    }
                })
                .catch(err => {
                    console.log('Error occured', err);
                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                })
        } catch (error) {
            console.error("Error adding charge:", error);
            getSweetAlert("Error", "Failed to add charge", "error");
        }
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={appointmentTopic ? 'Edit appointment reason' : 'Add New appointment reason'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* title */}
                <div>
                    <label className="block text-sm text-slate-300 mb-2">Title</label>
                    <input
                        type="text"
                        placeholder="Fingerprint authentication"
                        {...register('title', {
                            required: 'Reason title is required',
                            minLength: { value: 3, message: 'Title must be at least 3 characters' }
                        })}
                        className={`w-full px-3 py-2 bg-slate-900/50 border rounded-lg text-white text-sm
                            placeholder-slate-500 focus:outline-none focus:ring-2 transition-all
                            ${errors.title ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-700/50 focus:ring-blue-500'}`}
                    />
                    {errors.title && (
                        <div className="flex items-center gap-1 mt-1.5 text-red-400 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {errors.title.message}
                        </div>
                    )}
                </div>

                {/* description */}
                <div>
                    <label className="block text-sm text-slate-300 mb-2">
                        Description
                    </label>
                    <textarea
                        rows={3} placeholder="10"
                        {...register('reason_description', {
                            required: 'Reason description is required'
                        })}
                        className={`w-full px-3 py-2 bg-slate-900/50 border rounded-lg text-white text-sm
                            placeholder-slate-500 focus:outline-none focus:ring-2 transition-all resize-none
                            ${errors.reason_description ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-700/50 focus:ring-blue-500'}`} />

                    {errors.reason_description && (
                        <div className="flex items-center gap-1 mt-1.5 text-red-400 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {errors.reason_description.message}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <button
                        type="submit"
                        disabled={isReasonsLoading}
                        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg
                            transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                    >
                        <Icon className={`w-4 h-4 ${isReasonsLoading ? 'animate-spin' : ''}`} />
                        {appointmentTopic ? 'Update' : 'Add'}
                    </button>

                    <button
                        type="button"
                        onClick={handleCloseModal}
                        disabled={isReasonsLoading}
                        className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg
                            transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AppointmentTopicModal;