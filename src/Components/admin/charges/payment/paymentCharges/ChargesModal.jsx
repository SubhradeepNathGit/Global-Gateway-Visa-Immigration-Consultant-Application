import React, { useEffect } from 'react'
import { Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { addCharge, fetchCharges, updateCharge } from '../../../../../Redux/Slice/chargesSlice';
import hotToast from '../../../../../util/alert/hot-toast';
import getSweetAlert from '../../../../../util/alert/sweetAlert';


const ChargesModal = ({ Modal, isModalOpen, charges, setIsModalOpen, editingCourse }) => {

    const dispatch = useDispatch();
    const { isChargesLoading, allCharges, hasChargesError } = useSelector(state => state?.charge);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            label: "",
            percentage: "",
        }
    });

    const Icon = isChargesLoading ? Loader2 : Check;

    const handleCloseModal = () => {
        setIsModalOpen(false);
        reset({
            label: "",
            percentage: "",
        });
    };

    const onSubmit = (data) => {

        const labelExists = charges?.some(c => (c?.purpose?.toLowerCase() === 'course' && c?.charge_type?.toLowerCase() === data?.label?.trim()?.toLowerCase()));

        if (labelExists) {
            getSweetAlert("Oops...", "The charge is already exists", "warning");
            return;
        }

        try {
            const newChargeData = {
                charge_type: data?.label?.trim()?.toUpperCase(),
                percentage: data?.percentage,
                purpose: 'course',
                amount: null,
                status: false
            }

            dispatch(editingCourse ? updateCharge({
                id: editingCourse?.id,
                type: 'course',
                updatedData: {
                    charge_type: data?.label?.trim()?.toUpperCase(),
                    percentage: Number(data?.percentage),
                    purpose: 'course',
                    amount: null,
                    status: data?.status
                }
            }) : addCharge({ type: 'course', chargeData: newChargeData }))
                .then(res => {
                    // console.log('Response for adding charges', res);

                    if (res.meta.requestStatus === "fulfilled") {
                        reset({ label: "", percentage: "" });
                        setIsModalOpen(false);
                        hotToast(`${editingCourse ? 'Charge updated' : 'New charge added'} successfully`, "success");
                        dispatch(fetchCharges({ type: 'course' }))
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
    }

    useEffect(() => {
        if (editingCourse) {
            reset({
                label: editingCourse.charge_type ?? "",
                percentage: editingCourse.percentage ?? "",
            });
        }
    }, [editingCourse, reset]);

    return (
        <Modal
            isOpen={isModalOpen} onClose={handleCloseModal}
            title={editingCourse ? 'Edit Course Fee Charge' : 'Add New Course Fee Charge'}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-300 mb-2">Charge Name</label>
                        <input
                            type="text" placeholder="Service Charge"
                            disabled={isChargesLoading} maxLength={100}
                            {...register("label", {
                                required: "Charge name is required",
                            })}
                            className={`w-full px-3 py-2 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 ${errors?.label ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-700/50'}`}
                        />
                        {errors?.label && (
                            <div className="flex items-center gap-1 mt-1.5 text-red-400 text-xs">
                                <AlertCircle className="w-3 h-3" />
                                {errors?.label?.message}
                            </div>
                        )}
                    </div>

                    {/* {isGSTForm ? (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-slate-300 mb-2">SGST %</label>
                                    <input
                                        type="number"
                                        placeholder="9"
                                        step="0.01"
                                        min="0"
                                        max="50"
                                        value={newCharge.sgst}
                                        onChange={(e) => {
                                            setNewCharge({ ...newCharge, sgst: e.target.value });
                                            setErrors({ ...errors, sgst: '' });
                                        }}
                                        className={`w-full px-3 py-2 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.sgst ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-700/50'
                                            }`}
                                    />
                                    {errors.sgst && (
                                        <div className="flex items-center gap-1 mt-1.5 text-red-400 text-xs">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.sgst}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-300 mb-2">CGST %</label>
                                    <input
                                        type="number"
                                        placeholder="9"
                                        step="0.01"
                                        min="0"
                                        max="50"
                                        value={newCharge.cgst}
                                        onChange={(e) => {
                                            setNewCharge({ ...newCharge, cgst: e.target.value });
                                            setErrors({ ...errors, cgst: '' });
                                        }}
                                        className={`w-full px-3 py-2 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.cgst ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-700/50'
                                            }`}
                                    />
                                    {errors.cgst && (
                                        <div className="flex items-center gap-1 mt-1.5 text-red-400 text-xs">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.cgst}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {newCharge.sgst && newCharge.cgst && !errors.sgst && !errors.cgst && (
                                <div className="text-center text-sm text-slate-300 bg-slate-700/30 rounded-lg py-2">
                                    Total GST: <span className="font-semibold text-green-400">{(parseFloat(newCharge.sgst) + parseFloat(newCharge.cgst)).toFixed(2)}%</span>
                                </div>
                            )}
                        </div>
                    ) : ( */}
                    <div>
                        <label className="block text-sm text-slate-300 mb-2">Percentage (%)</label>
                        <input
                            type="number" placeholder="5" step="0.01" min="0" max="100"
                            disabled={isChargesLoading}
                            {...register("percentage", {
                                required: "Percentage is required",
                                min: {
                                    value: 0,
                                    message: "Percentage must be 0 or more",
                                },
                            })}
                            className={`w-full px-3 py-2 bg-slate-900/50 border rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.percentage ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-700/50'
                                }`} />
                        {errors?.percentage && (
                            <div className="flex items-center gap-1 mt-1.5 text-red-400 text-xs">
                                <AlertCircle className="w-3 h-3" />
                                {errors?.percentage?.message}
                            </div>
                        )}
                    </div>
                    {/* )} */}
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        type="submit" disabled={isChargesLoading}
                        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed">
                        <Icon className={`w-4 h-4 ${isChargesLoading ? 'animate-spin' : ''}`} />
                        {editingCourse ? 'Update Charge' : 'Add Charge'}
                    </button>
                    <button
                        onClick={handleCloseModal} disabled={isChargesLoading}
                        className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed">
                        <X className="w-4 h-4" />
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default ChargesModal