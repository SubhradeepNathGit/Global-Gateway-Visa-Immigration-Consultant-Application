import React, { useState } from 'react'
import { Ban, CircleCheckBig, Loader2, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { deleteHoliday, fetchHolidays, updateHoliday } from '../../../../Redux/Slice/holidaySlice';
import { addNotification } from '../../../../Redux/Slice/notificationSlice';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import hotToast from '../../../../util/alert/hot-toast';
import { createPortal } from 'react-dom';
import ConfirmBlockUnblockAlert from '../../common/alerts/ConfirmBlockUnblockAlert';

const HolidayRow = ({ holiday, monthNames, uniqueCountryIds }) => {
    const dispatch = useDispatch();
    const unpad2 = (num) => String(num).replace(/^0+/, "") || "0";

    const [specificHoliday, setSpecificHoliday] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [alertModalOpen, setAlertModalOpen] = useState(false);

    const parseHolidayDate = (dateStr) => {
        if (!dateStr) return null;

        const cleaned = dateStr.replace(/[{}]/g, "");
        const parts = cleaned.split(",");

        const obj = {};
        parts.forEach(part => {
            const [key, value] = part.split(":");
            obj[key.trim()] = Number(value);
        });

        return obj;
    }

    const formatHolidayDate = (dateStr) => {
        const [, month, day] = dateStr.match(/month:(\d+),day:(\d+)/) || [];
        if (!month || !day) return 'Invalid date';

        const date = new Date(2024, parseInt(month) - 1, parseInt(day));
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short'
        });
    };

    const handleUpdateStatusHoliday = async () => {
        try {
            const updatedStatus = !specificHoliday.status;

            const dateObj = parseHolidayDate(specificHoliday?.date);

            const notification_obj = {
                application_id: null,
                title: `Holiday held in the occassion of ${specificHoliday?.event_name} on ${dateObj?.day},${monthNames[unpad2(dateObj?.month) - 1]?.slice(0, 3)} is ${!updatedStatus ? 'cancelled' : 'applied'}`,
                receiver_type: 'embassy',
                receiver_country_id: uniqueCountryIds,
                mark_read: false
            }

            dispatch(updateHoliday({
                id: specificHoliday.id,
                updatedData: { ...specificHoliday, status: updatedStatus }
            })).then(res => {
                dispatch(addNotification(notification_obj))
                    .then(res => {
                        // console.log('Response for updating notification', res);

                        if (res?.meta?.requestStatus == "fulfilled") {
                            hotToast(`Holiday ${updatedStatus ? "unblocked" : "blocked"} successfully`, "success");
                            setSpecificHoliday(null);
                            setActionType(null);
                            setAlertModalOpen(false);
                            // dispatch(fetchHolidays());
                        }
                        else {
                            getSweetAlert('Oops...', 'Something went wrong!', 'error');
                        }
                    }).catch(err => {
                        console.log('Error occured', err);
                        getSweetAlert('Oops...', 'Something went wrong!', 'error');
                    })
            }).catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })

        } catch (err) {
            console.error(err);
            getSweetAlert("Error", "Failed to update holiday status", "error");
        }
    };


    const handleDeleteHoliday = async () => {
        const dateObj = parseHolidayDate(specificHoliday?.date);

        const notification_obj = {
            application_id: null,
            title: `Holiday held in the occassion of ${specificHoliday?.event_name} on ${dateObj?.day},${monthNames[unpad2(dateObj?.month) - 1]?.slice(0, 3)} is cancelled`,
            receiver_type: 'embassy',
            receiver_country_id: uniqueCountryIds,
            mark_read: false
        }

        dispatch(deleteHoliday(specificHoliday.id))
            .then(res => {
                dispatch(addNotification(notification_obj))
                    .then(res => {
                        // console.log('Response for adding notification', res);

                        if (res?.meta?.requestStatus == "fulfilled") {
                            hotToast("Holiday deleted successfully", "success");
                            setSpecificHoliday(null);
                            dispatch(fetchHolidays());
                        }
                        else {
                            getSweetAlert('Oops...', 'Something went wrong!', 'error');
                        }
                    })
                    .catch(err => {
                        console.log('Error occured', err);
                        getSweetAlert('Oops...', 'Something went wrong!', 'error');
                    })
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    }

    const handleHolidayData = (holiday) => {
        setSpecificHoliday(holiday);
    }

    return (
        <>
            <div
                className="flex items-center justify-between gap-3 p-3 bg-slate-700/30 border border-slate-600/40 rounded-lg hover:border-slate-500/50 hover:bg-slate-700/40 transition-all group"
            >
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate relative ${holiday?.status ? 'text-white' : 'text-slate-400'}`}>
                        {holiday?.event_name}
                        <span className={`absolute text-[8px] mb-5 ml-3 ${holiday?.status ? 'text-green-400' : 'text-red-400'}`}>{holiday?.status ? 'Active' : 'In-active'}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {formatHolidayDate(holiday?.date)} (Annual)
                    </p>
                </div>
                <button
                    onClick={() => {
                        setSpecificHoliday(holiday);
                        setActionType("status");
                        setAlertModalOpen(true);
                    }} className={`p-1.5 text-slate-400 rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${holiday?.status ? 'hover:text-red-400 hover:bg-red-500/10' : 'hover:text-green-400 hover:bg-green-500/10'}`}
                    title={`${holiday?.status ? 'Block' : 'Unblock'}`}>
                    {holiday?.status ? (
                        <Ban className="text-red-500 w-4 h-4" />
                    ) : (
                        <CircleCheckBig className="text-green-600 w-4 h-4" />
                    )}
                </button>
                <button
                    onClick={() => {
                        setSpecificHoliday(holiday);
                        setActionType("delete");
                        setAlertModalOpen(true);
                    }} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {alertModalOpen && createPortal(
                <ConfirmBlockUnblockAlert
                    open={alertModalOpen}
                    onClose={() => setAlertModalOpen(false)}
                    onConfirm={
                        actionType === "delete" ? handleDeleteHoliday : handleUpdateStatusHoliday
                    }
                    buttonText={
                        actionType === "delete" ? "Delete" : specificHoliday?.status ? "Block" : "Unblock"
                    }
                    type={
                        actionType === "delete" ? "Delete" : specificHoliday?.status ? "Block" : "Unblock"
                    }
                    title={
                        actionType === "delete" ? "Delete Holiday Globally" : specificHoliday?.status ? "Block Holiday" : "Unblock Holiday"
                    }
                    message={
                        actionType === "delete"
                            ? "Are you sure you want to delete this holiday?"
                            : `Are you sure you want to ${specificHoliday?.status ? "block" : "unblock"} this holiday?`
                    }
                />,
                document.body
            )}
        </>
    )
}

export default HolidayRow