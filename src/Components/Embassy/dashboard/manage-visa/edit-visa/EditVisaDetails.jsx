import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Loader2, Lock, Save, X } from 'lucide-react'
import RequiredDocs from './RequiredDocs'
import AdditionalDocs from './AdditionalDocs'
import hotToast from '../../../../../util/alert/hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { addVisaDetail, updateVisaDetail } from '../../../../../Redux/Slice/VisaDetailsSlice'
import getSweetAlert from '../../../../../util/alert/sweetAlert'
import { useQueryClient } from "@tanstack/react-query";

const EditVisaDetails = ({ currentCountryVisaTypes, countryDetails, selectedCountry, editingVisa, setEditingVisa }) => {

    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const { visaDetails, loadingVisaDetails, visaDetailsError } = useSelector(state => state?.visaDetails);
    const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm({
        defaultValues: {
            blocked: false,
            processingTime: '',
            processingUnit: 'day',
            validityPeriod: '',
            validityUnit: 'day',
            applicationFees: '',
            status: 'active',
            visa_type: 'Single',
            requiredDocuments: ['']
        }
    })

    useEffect(() => {
        if (!editingVisa) return;

        reset({
            blocked: editingVisa.status ? editingVisa.status == 'active' ? false : true : false,
            processingTime: editingVisa.visa_processing_time?.split(" ")[0] || "",
            processingUnit: Number(editingVisa.visa_processing_time?.split(" ")[0]) > 1 ? editingVisa.visa_processing_time?.split(" ")[1]?.slice(0, -1) : editingVisa.visa_processing_time?.split(" ")[1] || "day",
            validityPeriod: editingVisa.visa_validity?.split(" ")[0] || "",
            validityUnit: Number(editingVisa.visa_validity?.split(" ")[0]) > 1 ? editingVisa.visa_validity?.split(" ")[1]?.slice(0, -1) : editingVisa.visa_validity?.split(" ")[1] || "day",
            applicationFees: editingVisa.visa_fees || "",
            status: editingVisa.status || "active",
            visa_type: editingVisa.entry_type || "Single",
            requiredDocuments: editingVisa.visa_documents?.length
                ? editingVisa.visa_documents
                : [""],
        });
    }, [editingVisa, editingVisa, reset]);

    const blocked = watch('blocked')

    // Handle form submission
    const onSubmit = (data) => {

        if (data?.applicationFees?.length == 0 || data?.processingTime?.length == 0 || data?.requiredDocuments?.length == 0 ||
            (data?.requiredDocuments?.length == 1 && data?.requiredDocuments?.[0]?.length == 0) || data?.validityPeriod?.length == 0) {
            hotToast('Please fill up all required fields', "error")
        }
        else {
            const policyObj = {
                country_id: countryDetails?.id,
                visa_id: typeof editingVisa === 'string' ? editingVisa : editingVisa?.visa_id,
                visitor_country_id: selectedCountry?.id,
                status: data?.blocked ? 'inactive' : data?.status,
                entry_type: data?.visa_type,
                visa_fees: data?.applicationFees,
                visa_processing_time: data?.processingTime + ' ' + data?.processingUnit + (Number(data?.processingTime?.trim()) > 1 ? 's' : ''),
                visa_validity: data?.validityPeriod + ' ' + data?.validityUnit + (Number(data?.validityPeriod?.trim()) > 1 ? 's' : ''),
                visa_documents: data?.requiredDocuments?.map(doc => doc?.charAt(0)?.toUpperCase() + doc?.slice(1))
            }
            // console.log('policy', policyObj);

            dispatch(typeof editingVisa === 'string' ? addVisaDetail(policyObj) : updateVisaDetail({ id: editingVisa?.id, updatedData: policyObj }))
                .then(res => {
                    // console.log(`Response for ${typeof editingVisa === 'string' ? 'adding' : 'updating'} policy details`, res);

                    if (res.meta.requestStatus === "fulfilled") {
                        hotToast(`Visa policy ${typeof editingVisa === 'string' ? 'added' : 'updated'} successfully`, "success");
                        reset();
                        setEditingVisa(null);
                        queryClient.invalidateQueries({
                            queryKey: ["visaDetails"],
                        });
                        queryClient.invalidateQueries({ queryKey: ["countryWiseAllVisaPolicy"] });
                    } else {
                        getSweetAlert("Oops...", res.payload, "error");
                    }
                })
                .catch(() => {
                    getSweetAlert("Oops...", "Something went wrong!", "error");
                })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border-2 border-blue-500 shadow-lg p-6 animate-slideIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        {currentCountryVisaTypes.find(v => v.id === editingVisa)?.name}
                    </h2>
                    <p className="text-sm text-gray-600">Configure policy for {selectedCountry.name}</p>
                </div>
                <button type="button" onClick={() => setEditingVisa(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="space-y-5">
                {/* Block Toggle */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-red-600" />
                            <div>
                                <p className="font-semibold text-red-900">Block this visa type</p>
                                <p className="text-sm text-red-700">Citizens from {selectedCountry.name} cannot apply</p>
                            </div>
                        </div>
                        <div className="relative">
                            <Controller
                                name="blocked"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <input
                                            type="checkbox"
                                            {...field}
                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
                                    </>
                                )}
                            />
                        </div>
                    </label>
                </div>

                {!blocked && (
                    <>
                        <AdditionalDocs register={register} errors={errors} control={control} />
                        <RequiredDocs control={control} />
                    </>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className={`flex-1 sm:flex-none px-6 py-2.5 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm inline-flex items-center justify-center gap-2 ${loadingVisaDetails ? 'cursor-not-allowed bg-blue-700' : 'cursor-pointer bg-blue-600'}`}
                    >
                        {loadingVisaDetails ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : <Save className="w-5 h-5" />}
                        Save Policy
                    </button>
                    <button
                        type="button"
                        onClick={() => setEditingVisa(null)}
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    )
}

export default EditVisaDetails
