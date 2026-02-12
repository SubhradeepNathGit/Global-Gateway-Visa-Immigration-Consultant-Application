import React, { useState } from 'react'
import { Trash2, Edit2, CalendarSync, Ban, CircleCheckBig } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { deleteAppointmentReason, fetchAppointmentReasons, updateAppointmentReasonStatus } from '../../../../Redux/Slice/appointmentReasonSlice';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import hotToast from '../../../../util/alert/hot-toast';
import { createPortal } from 'react-dom';
import ConfirmBlockUnblockAlert from '../../common/alerts/ConfirmBlockUnblockAlert';

const AppointmentTopicRow = ({ reason, setAppointmentTopic, setIsModalOpen }) => {

    const [currentReasonId, setCurrentReasonId] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [alertModalOpen, setAlertModalOpen] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(null);

    const dispatch = useDispatch();

    const handleEdit = (reason) => {
        setAppointmentTopic(reason);
        setIsModalOpen(true);
    };

    const handleToggleStatus = (reason) => {
        setCurrentReasonId(reason?.id);
        setUpdateStatus(!reason?.status);
        setActionType("status");
        setAlertModalOpen(true);
    }

    const handleDeleteReason = (reason) => {
        setCurrentReasonId(reason?.id);
        setActionType("delete");
        setAlertModalOpen(true);
    }

    const handleDeleteAppointmentReason = () => {
        try {
            dispatch(deleteAppointmentReason(currentReasonId))
                .then(res => {
                    // console.log('Response for deleting reason', res);

                    if (res.meta.requestStatus === "fulfilled") {
                        hotToast("Appointment reason deleted successfully", "success");
                        setAlertModalOpen(false);
                        setCurrentReasonId(null);
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
            console.error('Error deleting charge:', error);
            getSweetAlert('Error', 'Failed to delete charge', 'error');
        }
    };

    const handleUpdateStatusReason = () => {
        dispatch(updateAppointmentReasonStatus({ id: currentReasonId, status: updateStatus }))
            .then(res => {
                // console.log('Response for updating reason status', res);

                if (res?.meta?.requestStatus === "fulfilled") {
                    hotToast(`Appointment reason ${updateStatus ? 'activeted' : 'de-activated'} successfully`, "success");
                    setAlertModalOpen(false);
                    setCurrentReasonId(null);
                    setUpdateStatus(null);
                    dispatch(fetchAppointmentReasons());
                } else {
                    getSweetAlert("Error", "Update failed", "error");
                }
            }).catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    };

    return (
        <>
            <div className="flex items-center justify-between p-3.5 bg-slate-700/30 border border-slate-600/30 rounded-lg hover:border-slate-500/50 transition-all">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <CalendarSync className={`w-4 h-4 flex-shrink-0 ${reason?.status ? 'text-blue-400' : 'text-slate-500'}`} />

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className={`relative w-full font-semibold text-sm ${reason?.status ? 'text-white' : 'text-slate-400'}`}>
                                {reason?.type?.length > 25 ? reason?.type?.slice(0, 25) + '...' : reason?.type ?? 'N/A'}
                                <span className={`absolute text-[8px] mb-5 ml-3 px-2 py-0.5 bg-slate-700/50 rounded ${!reason?.status ? 'text-red-500' : 'text-green-600'}`}>
                                    {!reason?.status ? 'In-active' : 'Active'}
                                </span>
                            </p>
                        </div>
                        <span className={`text-xs ${reason.active ? 'text-slate-400' : 'text-slate-500'}`}>
                            {reason?.description?.length > 60 ? reason?.description?.slice(0, 60) + '...' : reason?.description}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={() => {
                            handleToggleStatus(reason);
                        }} className={`p-1.5 text-slate-400 rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${reason?.status ? 'hover:text-red-400 hover:bg-red-500/10' : 'hover:text-green-400 hover:bg-green-500/10'}`}
                        title={`${reason?.status ? 'Block' : 'Unblock'}`}>
                        {reason?.status ? (
                            <Ban className="text-red-500 w-4 h-4" />
                        ) : (
                            <CircleCheckBig className="text-green-600 w-4 h-4" />
                        )}
                    </button>

                    <button
                        onClick={() => handleEdit(reason)}
                        className="p-1.5 hover:bg-slate-700/50 rounded transition-colors cursor-pointer"
                        title="Edit"
                    >
                        <Edit2 className="w-4 h-4 text-blue-400" />
                    </button>

                    <button
                        onClick={() => { handleDeleteReason(reason); }}
                        className="p-1.5 hover:bg-slate-700/50 rounded transition-colors cursor-pointer"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                </div>
            </div>

            {alertModalOpen && createPortal(
                <ConfirmBlockUnblockAlert
                    open={alertModalOpen}
                    onClose={() => setAlertModalOpen(false)}
                    onConfirm={
                        actionType === "delete" ? handleDeleteAppointmentReason : handleUpdateStatusReason
                    }
                    buttonText={
                        actionType === "delete" ? "Delete" : updateStatus?.status ? "Block" : "Unblock"
                    }
                    type={
                        actionType === "delete" ? "Delete" : updateStatus?.status ? "Block" : "Unblock"
                    }
                    title={
                        (actionType === "delete" ? "Delete " : updateStatus?.status ? "Block " : "Unblock ") + "Reason"
                    }
                    message={
                        actionType === "delete"
                            ? "Are you sure you want to delete this appointment reason?"
                            : `Are you sure you want to ${updateStatus?.status ? "block" : "unblock"} this appointment reason?`
                    }
                />,
                document.body
            )}
        </>
    )
}

export default AppointmentTopicRow