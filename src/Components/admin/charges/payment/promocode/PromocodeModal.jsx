import React, { useEffect } from 'react'
import { Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { addCode, fetchCodes, updateCode } from '../../../../../Redux/Slice/promocodeSlice';
import hotToast from '../../../../../util/alert/hot-toast';
import getSweetAlert from '../../../../../util/alert/sweetAlert';
import { useDispatch, useSelector } from 'react-redux';

const PromocodeModal = ({ Modal, isModalOpen, promoCodes, setIsModalOpen, editingPromoCode }) => {

    const dispatch = useDispatch();
    const { isCodeLoading, allCode, hasCodesError } = useSelector(state => state?.promocode);
    const Icon = isCodeLoading ? Loader2 : Check;

    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm({
        defaultValues: {
            code: '',
            available: '',
            discount: '',
        }
    });

    useEffect(() => {
        if (editingPromoCode) {
            reset({
                code: editingPromoCode?.name || '',
                available: editingPromoCode?.apply_mode || '',
                discount: editingPromoCode?.discount_amount || '',
            });
        }
    }, [editingPromoCode, promoCodes, reset]);

    const handleCloseModal = () => {
        reset({ code: '', available: '', discount: '' });
        setIsModalOpen(false);
    };

    const onSubmit = (data) => {
        const code = data?.code?.toUpperCase();

        const isDuplicate = promoCodes?.some(
            p => p?.name === code && p?.id !== editingPromoCode?.id
        );

        if (isDuplicate) {
            setError('code', {
                type: 'manual',
                message: 'This code already exists',
            });
            return;
        }

        try {
            const newCodeData = {
                name: code,
                discount_amount: data?.discount,
                apply_mode: data?.available,
                status: false
            }

            dispatch(editingPromoCode ? updateCode({
                id: editingPromoCode?.id,
                updatedData: {
                    name: code,
                    discount_amount: data?.discount,
                    apply_mode: data?.available,
                    status: editingPromoCode?.status
                }
            }) : addCode({ codeData: newCodeData }))
                .then(res => {
                    // console.log('Response for adding promocodes', res);

                    if (res.meta.requestStatus === "fulfilled") {
                        reset({ code: '', available: '', discount: '' });
                        handleCloseModal(false);
                        hotToast(`${editingPromoCode ? 'Promocode updated' : 'New promocode added'} successfully`, "success");
                        dispatch(fetchCodes())
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
            title={editingPromoCode ? 'Edit Promo Code' : 'Add New Promo Code'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Code */}
                <div>
                    <label className="block text-sm text-slate-300 mb-2">Code</label>
                    <input
                        type="text"
                        placeholder="SAVE20"
                        maxLength={20}
                        {...register('code', {
                            required: 'Code is required',
                            minLength: { value: 3, message: 'Code must be at least 3 characters' },
                            maxLength: { value: 20, message: 'Code must be less than 20 characters' },
                            pattern: {
                                value: /^[A-Z0-9]+$/,
                                message: 'Code must contain only letters and numbers',
                            },
                            setValueAs: (v) => v?.toUpperCase(),
                        })}
                        className={`w-full px-3 py-2 bg-slate-900/50 border rounded-lg text-white text-sm font-mono uppercase
                            placeholder-slate-500 focus:outline-none focus:ring-2 transition-all
                            ${errors.code ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-700/50 focus:ring-blue-500'}`}
                    />
                    {errors.code && (
                        <div className="flex items-center gap-1 mt-1.5 text-red-400 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {errors.code.message}
                        </div>
                    )}
                </div>

                {/* Available */}
                <div>
                    <label className="block text-sm text-slate-300 mb-2">Available</label>
                    <select
                        {...register('available', {
                            required: 'Availability is required',
                        })}
                        className={`w-full px-3 py-2 bg-slate-900/50 border rounded-lg text-white text-sm
                            focus:outline-none focus:ring-2 transition-all
                            ${errors.available ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-700/50 focus:ring-blue-500'}`}
                    >
                        <option value="" disabled>Select availability</option>
                        <option value="first_time">First Time</option>
                        <option value="always">Always</option>
                    </select>
                    {errors.available && (
                        <div className="flex items-center gap-1 mt-1.5 text-red-400 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {errors.available.message}
                        </div>
                    )}
                </div>

                {/* Discount */}
                <div>
                    <label className="block text-sm text-slate-300 mb-2">Discount Percentage</label>
                    <input
                        type="number" min="1" max="100" placeholder="10"
                        {...register('discount', {
                            required: 'Discount is required',
                            min: { value: 1, message: 'Discount must be at least 1%' },
                            max: { value: 100, message: 'Discount cannot exceed 100%' },
                        })}
                        className={`w-full px-3 py-2 bg-slate-900/50 border rounded-lg text-white text-sm
                            placeholder-slate-500 focus:outline-none focus:ring-2 transition-all
                            ${errors.discount ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-700/50 focus:ring-blue-500'}`}
                    />
                    {errors.discount && (
                        <div className="flex items-center gap-1 mt-1.5 text-red-400 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {errors.discount.message}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <button
                        type="submit"
                        disabled={isCodeLoading}
                        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg
                            transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                    >
                        <Icon className={`w-4 h-4 ${isCodeLoading ? 'animate-spin' : ''}`} />
                        {editingPromoCode ? 'Update' : 'Add'}
                    </button>

                    <button
                        type="button"
                        onClick={handleCloseModal}
                        disabled={isCodeLoading}
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

export default PromocodeModal;
