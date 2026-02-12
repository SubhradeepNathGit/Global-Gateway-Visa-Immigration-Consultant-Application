import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Check, X } from "lucide-react";
import FormHeader from "./countryForm/FormHeader";
import BasicFormSection from "./countryForm/form-part/BasicFormSection";
import ImageMediaSection from "./countryForm/form-part/ImageMediaSection";
import GeographicalDetailsSection from "./countryForm/form-part/GeographicalDetailsSection";
import CulturalFinancialSection from "./countryForm/form-part/CulturalFinancialSection";
import ContentSection from "./countryForm/form-part/ContentSection";
import SettingsFormSection from "./countryForm/form-part/SettingsFormSection";
import FormBtnSection from "./countryForm/form-part/FormBtnSection";
import { useDispatch } from "react-redux";
import { addOrUpdateCountry, fetchAllCountryDetails } from "../../../Redux/Slice/countrySlice";
import getSweetAlert from "../../../util/alert/sweetAlert";
import { useCountryWiseVisaDetails } from "../../../tanstack/query/getCountryWiseVisaDetails";
import hotToast from "../../../util/alert/hot-toast";
import SettingsSection from "./countryFormConfig/SettingsSection";
import FormField from "./countryFormConfig/FormField";
import SelectField from "./countryFormConfig/SelectField";


const CountryFormModal = ({ isOpen, onClose, country, embassyCountryData }) => {
    const initialValuesRef = useRef(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const dispatch = useDispatch();

    // console.log('Editable country details', country);
    // console.log('Embassy country data', embassyCountryData);

    const { data: countryWiseVisaDetails, isLoading: isCountryWiseVisaLoading, error: countryWiseVisaError } = useCountryWiseVisaDetails(country?.id);

    const { register, handleSubmit, control, watch, reset, setValue, formState: { errors, isSubmitting } } = useForm({ defaultValues: { name: "", code: "", officialName: "", continent: "", region: "", capital: "", flagImage: "", countryImage: "", area: "", population: "", latitude: "", longitude: "", currency: "", currencyCode: "", currencySymbol: "", language: "", description: "" } });

    useEffect(() => {
        // If embassyCountryData exists (from approved embassy), use that data
        const values = embassyCountryData
            ? {
                name: embassyCountryData.countryName || "",
                description: embassyCountryData.countryDescription || "",
                countryImage: embassyCountryData.countryImage || "",
                code: "",
                officialName: "",
                continent: "",
                capital: "",
                flagImage: "",
                area: "",
                population: "",
                latitude: "",
                longitude: "",
                currency: "",
                currencyCode: "",
                currencySymbol: "",
                language: "",
                visaRequired: true,
                isActive: false,
            }
            : country
                ? {
                    name: country.name || "",
                    code: country.country_details?.code || "",
                    officialName: country.country_details?.official_name || "",
                    continent: country.country_details?.continents || "",
                    capital: country.country_details?.capital || "",
                    flagImage: country.country_details?.flag_url || "",
                    countryImage: country.image_url || "",
                    area: country.country_details?.area || "",
                    population: country.country_details?.population || "",
                    latitude: country.country_details?.latlng?.[0] || "",
                    longitude: country.country_details?.latlng?.[1] || "",
                    currency: country.country_details?.currency?.name || "",
                    currencyCode: country.country_details?.currency?.code || "",
                    currencySymbol: country.country_details?.currency?.symbol || "",
                    language: country.country_details?.languages || "",
                    description: country.description || "",
                    visaRequired: !countryWiseVisaDetails,
                    isActive: !country.is_blocked,
                }
                : {
                    name: "",
                    code: "",
                    officialName: "",
                    continent: "",
                    capital: "",
                    flagImage: "",
                    countryImage: "",
                    area: "",
                    population: "",
                    latitude: "",
                    longitude: "",
                    currency: "",
                    currencyCode: "",
                    currencySymbol: "",
                    language: "",
                    description: "",
                    visaRequired: true,
                    isActive: false,
                };

        // Save once per open/edit
        initialValuesRef.current = values;

        // Populate form
        reset(values);

        setImageFile(null);
        setUploadError(null);
    }, [country, embassyCountryData, reset]);

    const handleReset = () => {
        if (initialValuesRef.current) {
            reset(initialValuesRef.current);
            setImageFile(null);
            setUploadError(null);
        }
    };

    const onSubmit = async (data) => {

        const countryData = {
            id: country?.id,
            name: data.name,
            description: data.description,
            image: typeof (data.countryImage) == 'string' ? {
                docName: country?.image_name || embassyCountryData?.countryImageName || 'country-image',
                url: data.countryImage,
                isOld: true
            } : data.countryImage[0],
            is_blocked: true,
            is_approved: "fulfilled",

            code: data.code.toUpperCase(),
            official_name: data.officialName,
            capital: data.capital,
            continents: data.continent,
            latlng: [data.latitude, data.longitude],
            zoom: 5,
            area: data.area,
            population: data.population,
            flag_url: data.flagImage,
            languages: data.language,
            currency: { "name": data.currency, "symbol": data.currencySymbol, "code": data.currencyCode },

            user_type: 'admin'
        };
        // console.log('Received data from form', countryData);

        dispatch(addOrUpdateCountry({ countryData, type: "addCountry" }))
            .then(res => {
                // console.log('Response for adding or updating country', res);

                if (res?.meta?.requestStatus == "fulfilled") {
                    hotToast(`Country ${country ? 'updated' : 'added'} successfully!`, "success");
                    setShowSuccess(true);
                    reset();
                    setImageFile(null);
                    setTimeout(() => {

                        setShowSuccess(false);
                        onClose();
                        dispatch(fetchAllCountryDetails());
                    }, 1500);
                }
                else {
                    getSweetAlert('Oops...', res?.payload, 'error');
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-black/60 rounded-2xl border border-slate-700 w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl">
                <FormHeader country={country} onClose={onClose} embassyCountryData={embassyCountryData} />

                <div className="scroll-bar flex-1 overflow-y-auto p-6">
                    {showSuccess && <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center gap-3"><Check className="w-5 h-5 text-green-400 flex-shrink-0" /><span className="text-sm text-green-400">Country {country ? 'updated' : 'added'} successfully!</span></div>}
                    {uploadError && <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center gap-3"><X className="w-5 h-5 text-red-400 flex-shrink-0" /><span className="text-sm text-red-400">{uploadError}</span></div>}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        <BasicFormSection SettingsSection={SettingsSection} FormField={FormField} register={register} errors={errors} country={country} />

                        <ImageMediaSection SettingsSection={SettingsSection} FormField={FormField} country={country} uploading={uploading} setValue={setValue} setImageFile={setImageFile} imageFile={imageFile} register={register} watch={watch} errors={errors} embassyCountryData={embassyCountryData} />

                        <GeographicalDetailsSection SettingsSection={SettingsSection} SelectField={SelectField} FormField={FormField} register={register} errors={errors} />

                        <CulturalFinancialSection SettingsSection={SettingsSection} FormField={FormField} register={register} errors={errors} />

                        <ContentSection SettingsSection={SettingsSection} FormField={FormField} register={register} errors={errors} />

                        <SettingsFormSection SettingsSection={SettingsSection} control={control} watch={watch} />

                    </div>
                </div>
                <FormBtnSection country={country} isSubmitting={isSubmitting} uploading={uploading} handleSubmit={handleSubmit} onClose={onClose} onSubmit={onSubmit} handleReset={handleReset} />
            </div>
        </div>
    );
};

export default CountryFormModal;