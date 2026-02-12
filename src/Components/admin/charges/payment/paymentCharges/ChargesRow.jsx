import React, { useState } from 'react'
import { IndianRupee, Trash2, Edit2 } from 'lucide-react';
import ConfirmBlockUnblockAlert from '../../../common/alerts/ConfirmBlockUnblockAlert';
import { deleteCharge, fetchCharges, updateChargeStatus } from '../../../../../Redux/Slice/chargesSlice';
import hotToast from '../../../../../util/alert/hot-toast';
import getSweetAlert from '../../../../../util/alert/sweetAlert';
import { useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';

const ChargesRow = ({ charge, setEditingCourse, setIsModalOpen }) => {

    const [currentChargeId, setCurrentChargeId] = useState(null);
    const [alertModalOpen, setAlertModalOpen] = useState(false);
    const dispatch = useDispatch();

    const handleEdit = (course) => {
        setEditingCourse(course);
        setIsModalOpen(true);
    };

    const handleDeleteCharge = () => {
        try {
            dispatch(deleteCharge(currentChargeId))
                .then(res => {
                    // console.log('Response for deleting charge', res);

                    if (res.meta.requestStatus === "fulfilled") {
                        hotToast("Charge deleted successfully", "success");
                        setAlertModalOpen(false);
                        setCurrentChargeId(null);
                        dispatch(fetchCharges({ type: 'course' }));
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
    }

    const handleToggle = (id, updateStatus) => {
        dispatch(updateChargeStatus({ id, updateStatus, type: 'course' }))
            .then(res => {
                // console.log('Response for updating charges status', res);

                if (res?.meta?.requestStatus === "fulfilled") {
                    hotToast(`Charge ${updateStatus ? 'activeted' : 'de-activated'} successfully`, "success");
                } else {
                    getSweetAlert("Error", "Update failed", "error");
                }
            }).catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    };

    const handleCurrentCharge = (id) => {
        setCurrentChargeId(id);
    }

    return (
        <>
            <div className="flex items-center justify-between p-3.5 bg-slate-700/30 border border-slate-600/30 rounded-lg hover:border-slate-500/50 transition-all">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <IndianRupee className={`w-4 h-4 flex-shrink-0 ${charge?.status ? 'text-green-400' : 'text-red-500'}`} />

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className={`relative font-semibold text-sm ${charge?.status ? 'text-white' : 'text-slate-400'}`}>
                                {charge?.charge_type?.length > 30 ? charge?.charge_type?.slice(0, 30) + "..." : charge?.charge_type ?? 'N/A'}
                                
                                <span className={`absolute w-full text-[8px] mb-5 ml-3 ${!charge?.status ? 'text-red-500' : 'text-green-600'}`}>
                                    {!charge?.status ? 'In-active' : 'Active'}
                                </span>
                            </p>
                            {charge?.percentage == 0 && (
                                <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded">
                                    Free
                                </span>
                            )}
                        </div>
                        {/* {charge.isGST ? (
                        <div className={`text-xs ${charge.active ? 'text-slate-400' : 'text-slate-500'}`}>
                            SGST: {charge.sgst}% + CGST: {charge.cgst}% = {charge.sgst + charge.cgst}%
                        </div>
                    ) : ( */}
                        <span className={`text-xs ${charge?.status ? 'text-slate-400' : 'text-slate-500'}`}>
                            {charge?.percentage}%
                        </span>
                        {/* )} */}
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={() => handleToggle(charge?.id, !charge?.status)}
                        className={`relative w-11 h-6 rounded-full transition-all duration-200 focus:outline-none cursor-pointer ${charge?.status ? 'bg-green-500' : 'bg-slate-600'
                            }`}
                        title={charge?.status ? 'Deactivate' : 'Activate'}
                    >
                        <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${charge?.status ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                    </button>

                    <button
                        onClick={() => handleEdit(charge)}
                        className="p-1.5 hover:bg-slate-700/50 rounded transition-colors cursor-pointer"
                        title="Edit"
                    >
                        <Edit2 className="w-4 h-4 text-blue-400" />
                    </button>

                    <button
                        onClick={() => { handleCurrentCharge(charge?.id); setAlertModalOpen(true); }}
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
                    onConfirm={handleDeleteCharge}
                    buttonText={'Delete'}
                    type={'Delete'}
                    title={`Delete Charge`}
                    message={`Are you sure you want to delete the charge?`}
                />,
                document.body)}
        </>
    )
}

export default ChargesRow