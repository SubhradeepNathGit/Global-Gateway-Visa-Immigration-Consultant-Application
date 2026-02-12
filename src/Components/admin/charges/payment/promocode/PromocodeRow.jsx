import React, { useState } from 'react'
import { Tag, Trash2, Edit2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { deleteCode, fetchCodes, updateCodeStatus } from '../../../../../Redux/Slice/promocodeSlice';
import getSweetAlert from '../../../../../util/alert/sweetAlert';
import hotToast from '../../../../../util/alert/hot-toast';
import { createPortal } from 'react-dom';
import ConfirmBlockUnblockAlert from '../../../common/alerts/ConfirmBlockUnblockAlert';

const PromocodeRow = ({ promo, setEditingPromoCode, setIsModalOpen }) => {

    const [currentCodeId, setCurrentCodeId] = useState(null);
    const [alertModalOpen, setAlertModalOpen] = useState(false);
    const dispatch = useDispatch();

    const handleEdit = (code) => {
        setEditingPromoCode(code);
        setIsModalOpen(true);
    };

    const handleDeleteCode = () => {
        try {
            dispatch(deleteCode(currentCodeId))
                .then(res => {
                    // console.log('Response for deleting code', res);

                    if (res.meta.requestStatus === "fulfilled") {
                        hotToast("Promocode deleted successfully", "success");
                        setAlertModalOpen(false);
                        setCurrentCodeId(null);
                        dispatch(fetchCodes());
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

    const handleToggle = (id, updateStatus) => {
        dispatch(updateCodeStatus({ id, updateStatus }))
            .then(res => {
                // console.log('Response for updating code status', res);

                if (res?.meta?.requestStatus === "fulfilled") {
                    hotToast(`Promocode ${updateStatus ? 'activeted' : 'de-activated'} successfully`, "success");
                } else {
                    getSweetAlert("Error", "Update failed", "error");
                }
            }).catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    };

    const handleCurrentCode = (id) => {
        setCurrentCodeId(id);
    }

    return (
        <>
            <div className="flex items-center justify-between p-3.5 bg-slate-700/30 border border-slate-600/30 rounded-lg hover:border-slate-500/50 transition-all">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Tag className={`w-4 h-4 flex-shrink-0 ${promo?.status ? 'text-blue-400' : 'text-slate-500'}`} />

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className={`relative font-semibold text-sm ${promo?.status ? 'text-white' : 'text-slate-400'}`}>
                                {promo?.name ?? 'N/A'}
                            <span className={`absolute w-full text-[8px] mb-5 ml-3 ${!promo?.status?'text-red-500':'text-green-600'}`}>
                                {!promo?.status ? 'In-active' : 'Active'}
                            </span>
                            </p>
                        </div>
                        <span className={`text-xs ${promo.active ? 'text-slate-400' : 'text-slate-500'}`}>
                            {promo?.discount_amount}% discount
                        </span>
                        <span className={`text-xs px-2 ml-5 py-0.5 bg-slate-700/50 rounded ${promo?.apply_mode=='always'?'text-yellow-500':'text-blue-400'}`}>
                                {promo?.apply_mode=='always' ? 'Always' : 'First-time'}
                            </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={() => handleToggle(promo?.id, !promo?.status)}
                        className={`relative w-11 h-6 rounded-full transition-all duration-200 focus:outline-none cursor-pointer ${promo?.status ? 'bg-green-500' : 'bg-slate-600'
                            }`}
                        title={promo?.status ? 'Deactivate' : 'Activate'}
                    >
                        <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${promo?.status ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                    </button>

                    <button
                        onClick={() => handleEdit(promo)}
                        className="p-1.5 hover:bg-slate-700/50 rounded transition-colors cursor-pointer"
                        title="Edit"
                    >
                        <Edit2 className="w-4 h-4 text-blue-400" />
                    </button>

                    <button
                        onClick={() => { handleCurrentCode(promo?.id); setAlertModalOpen(true); }}
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
                    onConfirm={handleDeleteCode}
                    buttonText={'Delete'}
                    type={'Delete'}
                    title={`Delete Promocode`}
                    message={`Are you sure you want to delete the promocode?`}
                />,
                document.body)}
        </>
    )
}

export default PromocodeRow