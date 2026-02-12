import React, { useState } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { addVisa, addVisaToCountry, fetchCountryVisa, fetchVisaByType, updateCountryVisa } from '../../../../../Redux/Slice/visaSlice'
import { useDispatch, useSelector } from 'react-redux'
import hotToast from '../../../../../util/alert/hot-toast'
import getSweetAlert from '../../../../../util/alert/sweetAlert'
import { useQueryClient } from "@tanstack/react-query";

const VisaForm = ({ setIsAddingVisaType, selectedCountry, iconMapping, countryDetails }) => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const [selectedIconKey, setSelectedIconKey] = useState("");
    const SelectedIcon = iconMapping[selectedIconKey];
    const { visaListData, isVisaListloading, isVisaListerror } = useSelector(state => state?.visa);

    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
        mode: "onTouched",
        defaultValues: {
            visaType: "",
            visaIcon: ""
        }
    })

    const handleIconSelect = (iconName) => {
        setSelectedIconKey(iconName)
        setValue("visaIcon", iconName, { shouldValidate: true })
    }

    const handleVisa = async (data) => {
        // console.log("FORM DATA:", data)
        const visaType = data?.visaType?.split(" ")?.map(w => w?.charAt(0)?.toUpperCase() + w?.slice(1)?.toLowerCase()).join(" ");

        const visaData = {
            visa_type: visaType?.toLowerCase()?.includes('visa') ? visaType : visaType + " Visa",
            status: 'active'
        }

        const visaName = visaType?.toLowerCase()?.includes('visa') ? visaType : visaType + " Visa";

        const visaObj = {
            visaName: visaName?.split(" ")?.map(char => char?.charAt(0)?.toUpperCase() + char?.slice(1)?.toLowerCase())?.join(" "),
            visaIcon: data?.visaIcon,
            visitor_country: selectedCountry?.id
        }

        let visa = await dispatch(fetchVisaByType(visaObj.visaName)).unwrap()

        if (visa?.status == "inactive") {
            setIsAddingVisaType(false);
            hotToast("This Visa type is inactive right now. Try again later", "error");
        }
        else {
            // Add visa if not exists
            if (!visa) visa = await dispatch(addVisa(visaData)).unwrap()

            // Fetch country visa row
            let countryVisa = await dispatch(
                fetchCountryVisa({ countryId: countryDetails?.id, visitorCountryId: visaObj?.visitor_country })
            ).unwrap();

            if (!countryVisa) {
                dispatch(addVisaToCountry({
                    countryId: countryDetails?.id,
                    visitorCountry: visaObj?.visitor_country,
                    visaId: visa.id,
                    visaIconName: visaObj.visaIcon
                })).then(res => {
                    if (res.meta.requestStatus === "fulfilled") {
                        hotToast("Visa type added successfully! Now configure its policy.", "success");
                        reset();
                        setIsAddingVisaType(false);
                        queryClient.invalidateQueries({
                            queryKey: ["countryVisa", countryDetails.id],
                        });
                        queryClient.invalidateQueries({
                            queryKey: ["visa-enable-country", countryDetails.id],
                        });

                    } else {
                        getSweetAlert("Oops...", res.payload, "error");
                    }
                })
                    .catch(() => {
                        getSweetAlert("Oops...", "Something went wrong!", "error");
                    })
            } else if (!countryVisa.visa_id.includes(visa.id)) {
                dispatch(updateCountryVisa({
                    rowId: countryVisa.id,
                    visaId: visa.id,
                    visaIconName: visaObj.visaIcon,
                    existingVisaIds: countryVisa.visa_id,
                    existingVisaIcons: countryVisa.visa_icon
                })).then(res => {
                    if (res.meta.requestStatus === "fulfilled") {
                        hotToast("Visa type added successfully! Now configure its policy.", "success");
                        reset();
                        setIsAddingVisaType(false);
                        queryClient.invalidateQueries({
                            queryKey: ["countryVisa", countryDetails.id],
                        });
                        queryClient.invalidateQueries({
                            queryKey: ["visa-enable-country", countryDetails.id],
                        });

                    } else {
                        getSweetAlert("Oops...", res.payload, "error");
                    }
                })
                    .catch(() => {
                        getSweetAlert("Oops...", "Something went wrong!", "error");
                    })
            }
            else {
                hotToast("Visa type already exist.", "error");
                setIsAddingVisaType(false);
            }
        }
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit(handleVisa)}>

            {/* Visa Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visa Type Name *</label>
                <input
                    type="text"
                    {...register("visaType", {
                        required: "Visa type required"
                    })}
                    placeholder="e.g., Medical Visa, Transit Visa"
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                />
                {errors.visaType && (
                    <p className="text-xs text-red-400 mt-2">
                        {errors.visaType.message}
                    </p>
                )}
            </div>

            {/* Icon Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Icon *
                </label>

                {/* Hidden field for react-hook-form */}
                <input type="hidden"
                    {...register("visaIcon", {
                        required: "Please select an icon"
                    })}
                />

                <div className="flex items-center justify-center gap-4">
                    <div className="grid grid-cols-6 gap-3">
                        {Object.entries(iconMapping).map(([name, Icon]) => (
                            <button key={name} type="button"
                                onClick={() => handleIconSelect(name)}
                                className={`border rounded-lg p-3 flex flex-col items-center gap-1
                                    ${selectedIconKey === name
                                        ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}>
                                <Icon className="w-6 h-6 text-blue-600" />
                                <span className="text-xs">{name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Preview */}
                    <div className="w-18 h-18 border rounded-lg flex items-center justify-center bg-gray-50">
                        {SelectedIcon ? (
                            <SelectedIcon className="w-6 h-6 text-blue-600" />
                        ) : (
                            <span className="text-xs text-gray-400">Icon</span>
                        )}
                    </div>
                </div>

                {errors.visaIcon && (
                    <p className="text-xs text-red-400 mt-2">
                        {errors.visaIcon.message}
                    </p>
                )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
                <button type="submit" className={`px-6 py-2.5 hover:bg-blue-800 text-white rounded-lg flex items-center gap-2 ${isVisaListloading ? 'cursor-not-allowed bg-blue-800' : 'cursor-pointer bg-blue-600'}`}>
                    {isVisaListloading ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : <Plus className="w-5 h-5" />}
                    Add Visa Type
                </button>

                <button type="button" onClick={() => setIsAddingVisaType(false)}
                    className="px-6 py-2.5 bg-gray-100 rounded-lg">
                    Cancel
                </button>
            </div>

        </form>
    )
}

export default VisaForm