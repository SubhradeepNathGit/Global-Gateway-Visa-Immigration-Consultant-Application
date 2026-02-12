import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileText, Briefcase, CheckCircle2, ChevronDown, Plus, X } from "lucide-react";
import FileInput from "../FileInput";
import StepButtons from "../StepButtons";
import { saveStepProgress, saveVisaDetails } from "../../../../../Redux/Slice/applicationSlice";
import getSweetAlert from "../../../../../util/alert/sweetAlert";
import { useVisaDetailsByApplicationId } from "../../../../../tanstack/query/getApplicationVisaDetails";
import { addActivity } from "../../../../../Redux/Slice/activitySlice";

export default function Step3VisaType({ onNext, onBack, countryWiseVisaDetails, user_id, application_id }) {
    const dispatch = useDispatch();
    const { isApplicationLoading, visaTypeData } = useSelector(state => state.application);
    const { data: visaData, isLoading: isVisaDataLoading, error: isVisaDataError } = useVisaDetailsByApplicationId(application_id);

    // console.log('Visa lists', countryWiseVisaDetails);
    // console.log('Visa data retrive', visaData);

    const visaTypes = [
        { value: "", label: "Select visa type" },
        ...(countryWiseVisaDetails || [])?.filter(visa => visa?.status == 'active')?.map(v => ({
            value: v?.visa?.visa_type,
            label: v?.visa?.visa_type?.charAt(0)?.toUpperCase() + v?.visa?.visa_type?.slice(1).toLowerCase()
        }))
    ];

    const documentRequirements = React.useMemo(() => {
        const obj = {};
        (countryWiseVisaDetails || [])?.forEach(doc => {
            obj[doc?.visa_type] = doc?.visa_details?.[0]?.visa_documents || [];
        });
        // console.log(obj);

        return obj;
    }, [countryWiseVisaDetails]);

    const [selectedVisaType, setSelectedVisaType] = useState(visaTypeData?.visaType || "");
    const [selectedVisaId, setSelectedVisaId] = useState(visaTypeData?.visaId || "");
    const [visaPurpose, setVisaPurpose] = useState(visaTypeData?.visaPurpose || "");
    const [visaValidity, setVisaValidity] = useState(visaTypeData?.visaValidity || "");
    const [visaEntryType, setVisaEntryType] = useState(visaTypeData?.visaEntryType || "");
    const [supportingDocs, setSupportingDocs] = useState([{ id: 1, file: null, preview: null, error: null }]);
    const [errors, setErrors] = useState({});

    const maxPurposeLength = 100;
    const maxDocuments = 5;

    useEffect(() => {
        if (!visaData) return;

        const parseUrl = (value) => {
            if (!value) return null;
            try {
                const parsed = JSON.parse(value);
                return parsed.publicUrl || null;
            } catch {
                return value;
            }
        };

        if (visaData?.visa_type) {
            setSelectedVisaType(visaData.visa_type);
        }

        if (visaData?.visaId) {
            setSelectedVisaId(visaData.visaId);
        }

        if (visaData?.purpose) {
            setVisaPurpose(visaData.purpose);
        }

        if (visaData?.validity) {
            setVisaValidity(visaData.validity);
        }

        if (visaData?.entry_type) {
            setVisaEntryType(visaData.entry_type);
        }

        // Prepare supporting documents array
        const docs = [];

        for (let i = 1; i <= 5; i++) {
            const pathKey = `document${i}_path`;
            const nameKey = `document${i}_name`;

            const url = parseUrl(visaData[pathKey]);
            const name = visaData[nameKey];

            if (url) {
                docs.push({
                    id: i,
                    file: {
                        url: url,
                        docName: name,
                        isOld: true,
                        file: {
                            url: url
                        }
                    },
                    preview: url,
                    error: null
                });
            }
        }

        setSupportingDocs(docs);

    }, [visaData]);

    const activity_obj = {
        title: 'Documents upload pending',
        icon: 'pending'
    }

    const validateFile = (file) => {
        const maxSize = 300 * 1024; // 300KB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

        if (!file) {
            return 'Document is required';
        }

        if (file.size > maxSize) {
            return 'File size must be less than 300KB';
        }

        if (!allowedTypes.includes(file.type)) {
            return 'Only JPG, PNG, JPEG, or PDF files are allowed';
        }

        return null;
    };

    const handleVisaTypeChange = (e) => {
        const value = e.target.value;
        setSelectedVisaType(value);

        const choosedVisaDetails = countryWiseVisaDetails.find(visa => (visa?.visa?.visa_type == value));
        // console.log(choosedVisaDetails);

        setSelectedVisaId(choosedVisaDetails?.id);
        setVisaValidity(choosedVisaDetails?.visa_validity);
        setVisaEntryType(choosedVisaDetails?.entry_type);

        if (value) {
            setErrors(prev => ({ ...prev, visaType: null }));
        }
    };

    const handlePurposeChange = (e) => {
        const value = e.target.value;
        if (value.length <= maxPurposeLength) {
            setVisaPurpose(value);
            if (value.trim()) {
                setErrors(prev => ({ ...prev, purpose: null }));
            }
        }
    };

    const handleDocumentChange = (docId, file) => {
        setSupportingDocs(prev => prev.map(doc => {
            if (doc.id === docId) {
                if (file === null) {
                    return { ...doc, file: null, preview: null, error: null };
                }

                const error = validateFile(file);
                if (error) {
                    return { ...doc, file: null, preview: null, error };
                }

                const preview = URL.createObjectURL(file);
                return {
                    ...doc,
                    file: { file, isOld: false },
                    preview,
                    error: null
                };
            }
            return doc;
        }));
    };

    const addDocument = () => {
        if (supportingDocs.length < maxDocuments) {
            setSupportingDocs(prev => [
                ...prev,
                { id: Date.now(), file: null, preview: null, error: null }
            ]);
        }
    };

    const removeDocument = (docId) => {
        if (supportingDocs.length > 1) {
            setSupportingDocs(prev => {
                const docToRemove = prev.find(d => d.id === docId);
                if (docToRemove?.preview && docToRemove.file?.file instanceof File) {
                    URL.revokeObjectURL(docToRemove.preview);
                }
                return prev.filter(doc => doc.id !== docId);
            });
        }
    };

    const submit = async () => {
        const visaTypeError = !selectedVisaType ? 'Please select a visa type' : null;
        const purposeError = !visaPurpose?.trim() ? 'Please provide a purpose for your visa' : null;

        // Validate at least one document is uploaded
        const hasAtLeastOneDoc = supportingDocs.some(doc => doc.file !== null);
        const docError = !hasAtLeastOneDoc ? 'Please upload at least one supporting document' : null;

        // Validate each uploaded document
        const updatedDocs = supportingDocs.map(doc => {
            if (doc.file && !doc.file.isOld) {
                const error = validateFile(doc.file.file);
                return { ...doc, error };
            }
            return doc;
        });

        const hasDocErrors = updatedDocs.some(doc => doc.error !== null);

        if (visaTypeError || purposeError || docError || hasDocErrors) {
            setErrors({
                visaType: visaTypeError,
                visaId: selectedVisaId,
                purpose: purposeError,
                document: docError
            });
            setSupportingDocs(updatedDocs);
            return;
        }

        const application_obj = {
            step: 4,
            completedSteps: [1, 2, 3]
        };

        // Prepare documents array for submission
        const docsToSubmit = supportingDocs
            .filter(doc => doc.file !== null)
            .map(doc => doc.file);

        dispatch(saveVisaDetails({
            applicationId: application_id,
            payload: {
                visaType: selectedVisaType,
                visaId: selectedVisaId,
                visaPurpose: visaPurpose,
                validity: visaValidity,
                entry_type: visaEntryType,
                supportingDocs: docsToSubmit
            }
        }))
            .then(res => {
                if (res.meta.requestStatus === "fulfilled") {
                    dispatch(saveStepProgress({ applicationId: application_id, ...application_obj }))
                        .then(res => {
                            if (res.meta.requestStatus === "fulfilled") {

                                dispatch(addActivity({ ...activity_obj, application_id: res?.meta?.arg?.applicationId }))
                                    .then(res => {
                                        // console.log('Response for adding activity', res);

                                        if (res.meta.requestStatus === "fulfilled") {

                                            onNext();
                                        }
                                        else {
                                            getSweetAlert('Oops...', 'Something went wrong!', 'info');
                                        }
                                    })
                                    .catch(err => {
                                        console.log('Error occured', err);
                                        getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                    })
                            } else {
                                getSweetAlert('Oops...', 'Something went wrong!', 'info');
                            }
                        })
                        .catch(err => {
                            console.log('Error occurred', err);
                            getSweetAlert('Oops...', 'Something went wrong!', 'error');
                        });
                } else {
                    getSweetAlert('Oops...', 'Something went wrong!', 'info');
                }
            })
            .catch(err => {
                console.log('Error occurred', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
    };

    const uploadedDocsCount = supportingDocs.filter(doc => doc.file !== null).length;
    const isComplete = selectedVisaType && visaPurpose?.trim() && uploadedDocsCount > 0;

    useEffect(() => {
        return () => {
            supportingDocs.forEach(doc => {
                if (doc.preview && doc.file?.file instanceof File) {
                    URL.revokeObjectURL(doc.preview);
                }
            });
        };
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8">
            {/* Header */}
            <div className="mb-8 sm:mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-200">
                        <Briefcase className="text-white" size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Visa Type & Documents
                        </h2>
                        <p className="text-sm text-gray-600 mt-0.5">Select your visa type and upload supporting documents</p>
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <div className="space-y-6">
                {/* Visa Type Selection Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Briefcase size={20} className="text-red-600" strokeWidth={2.5} />
                        Visa Type Selection
                    </h3>

                    <div className="space-y-2 mb-6">
                        <label className="block text-sm font-semibold text-gray-900">
                            Select Visa Type <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={selectedVisaType}
                                onChange={handleVisaTypeChange}
                                className={`w-full px-4 py-3 pr-10 border-2 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-900 font-medium bg-white ${errors.visaType
                                    ? 'border-red-300 bg-red-50'
                                    : selectedVisaType
                                        ? 'border-green-300 bg-green-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {visaTypes.map((type, index) => (
                                    <option key={index} value={type.value} disabled={type.value === ""}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                size={20}
                            />
                        </div>
                        {errors.visaType && (
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                <span className="text-red-500">⚠</span> {errors.visaType}
                            </p>
                        )}
                        {selectedVisaType && !errors.visaType && (
                            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                                <CheckCircle2 size={14} /> Visa type selected
                            </p>
                        )}
                    </div>

                    {/* Purpose for Visa */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">
                            Purpose for Visa <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <textarea
                                value={visaPurpose}
                                onChange={handlePurposeChange}
                                placeholder="Briefly describe the purpose of your visa application..."
                                rows={3}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-900 resize-none ${errors.purpose
                                    ? 'border-red-300 bg-red-50'
                                    : visaPurpose?.trim()
                                        ? 'border-green-300 bg-green-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            />
                            <div className="absolute bottom-2 right-3">
                                <span className="text-[10px] text-gray-400">
                                    {visaPurpose.length}/{maxPurposeLength}
                                </span>
                            </div>
                        </div>
                        {errors.purpose && (
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                <span className="text-red-500">⚠</span> {errors.purpose}
                            </p>
                        )}
                        {visaPurpose?.trim() && !errors.purpose && (
                            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                                <CheckCircle2 size={14} /> Purpose provided
                            </p>
                        )}
                    </div>
                </div>

                {/* Supporting Documents Upload Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <FileText size={20} className="text-red-600" strokeWidth={2.5} />
                            Supporting Documents
                        </h3>
                        {supportingDocs.length < maxDocuments && (
                            <button
                                onClick={addDocument}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                            >
                                <Plus size={16} strokeWidth={2.5} />
                                Add More
                            </button>
                        )}
                    </div>

                    {/* Document Requirements Note */}
                    {selectedVisaType && documentRequirements[selectedVisaType] && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <p className="text-sm font-bold text-blue-900 mb-2">Required Documents for {visaTypes.find(v => v.value === selectedVisaType)?.label}:</p>
                            <ul className="text-sm text-blue-800 space-y-1">
                                {documentRequirements[selectedVisaType].map((doc, idx) => (
                                    <li key={idx}>• {doc}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {errors.document && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 flex items-center gap-1">
                                <span className="text-red-500">⚠</span> {errors.document}
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {supportingDocs.map((doc, index) => (
                            <div key={doc.id} className="relative">
                                {supportingDocs.length > 1 && (
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-gray-700">
                                            Document {index + 1}
                                        </span>
                                        <button
                                            onClick={() => removeDocument(doc.id)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                            title="Remove document"
                                        >
                                            <X size={18} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                )}
                                <FileInput
                                    label={supportingDocs.length === 1 ? "Upload Supporting Document" : ""}
                                    description={index === 0 ? "Upload relevant documents based on your visa type" : ""}
                                    onFileChange={(file) => handleDocumentChange(doc.id, file)}
                                    accept="image/*,application/pdf"
                                    previewUrl={doc?.preview}
                                    noChange={doc?.file?.isOld}
                                    file={doc?.file}
                                    error={doc?.error}
                                    maxSize="300KB"
                                    required={index === 0}
                                />
                            </div>
                        ))}
                    </div>

                    {supportingDocs.length >= maxDocuments && (
                        <p className="mt-4 text-sm text-gray-600 text-center">
                            Maximum {maxDocuments} documents can be uploaded
                        </p>
                    )}
                </div>

                {/* Requirements Info */}
                <div className="bg-gradient-to-r from-white to-transparent">
                    <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="text-sm">
                            <p className="font-bold text-red-700 mb-2">Document Guidelines</p>

                            <ul className="text-gray-700 space-y-2 leading-6">
                                <li>
                                    • All documents must be <span className="font-bold">clear</span>,
                                    <span className="font-bold"> readable</span>, and
                                    <span className="font-bold"> in color </span> (no blurred or cropped images).
                                </li>

                                <li>
                                    • Documents must be <span className="font-bold">original</span> and not digitally altered or edited.
                                </li>

                                <li>
                                    • Ensure your <span className="font-bold">full name</span>,
                                    <span className="font-bold">date of birth</span>, and
                                    <span className="font-bold"> document number</span> are clearly visible.
                                </li>

                                {/* <li>
                                    • Passport must have a minimum of <span className="font-bold">6 months validity</span> from the date of travel.
                                </li>

                                <li>
                                    • Photos must be <span className="font-bold">recent</span> (taken within the last 6 months).
                                </li>

                                <li>
                                    • Financial statements must be <span className="font-bold">stamped</span> or
                                    <span className="font-bold"> digitally verified</span> by the bank.
                                </li> */}

                                <li>
                                    • Employment documents must be on <span className="font-bold">official company letterhead</span>.
                                </li>

                                <li>
                                    • For minors, include <span className="font-bold">parental consent</span> and
                                    <span className="font-bold"> birth certificate</span>.
                                </li>
                            </ul>

                            <p className="text-red-700 mt-4 font-semibold">
                                You can upload up to {maxDocuments} documents. Accepted formats: JPG, PNG, PDF (max 300KB each).
                            </p>
                        </div>

                    </div>
                </div>

                {/* Progress Card */}
                {(selectedVisaType || visaPurpose || uploadedDocsCount > 0) && (
                    <div className={`rounded-2xl shadow-lg border-2 p-6 transition-all duration-500 ${isComplete
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300"
                        : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300"
                        }`}>
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isComplete ? "bg-green-100" : "bg-blue-100"
                                }`}>
                                {isComplete ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-600" strokeWidth={2.5} />
                                ) : (
                                    <Briefcase className="w-6 h-6 text-blue-600" strokeWidth={2.5} />
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className={`font-bold mb-2 text-base ${isComplete ? "text-green-900" : "text-blue-900"
                                    }`}>
                                    {isComplete ? "Information Complete ✓" : "Completion Progress"}
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className={isComplete ? "text-green-800" : "text-blue-800"}>
                                            Visa Type
                                        </span>
                                        <span className={`font-semibold ${selectedVisaType ? "text-green-600" : "text-gray-400"
                                            }`}>
                                            {selectedVisaType ? "✓ Selected" : "Pending"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className={isComplete ? "text-green-800" : "text-blue-800"}>
                                            Purpose for Visa
                                        </span>
                                        <span className={`font-semibold ${visaPurpose?.trim() ? "text-green-600" : "text-gray-400"
                                            }`}>
                                            {visaPurpose?.trim() ? "✓ Provided" : "Pending"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className={isComplete ? "text-green-800" : "text-blue-800"}>
                                            Supporting Documents
                                        </span>
                                        <span className={`font-semibold ${uploadedDocsCount > 0 ? "text-green-600" : "text-gray-400"
                                            }`}>
                                            {uploadedDocsCount > 0 ? `✓ ${uploadedDocsCount} Uploaded` : "Pending"}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className={isComplete ? "text-green-700" : "text-blue-700"}>
                                            {(selectedVisaType ? 1 : 0) + (visaPurpose?.trim() ? 1 : 0) + (uploadedDocsCount > 0 ? 1 : 0)} of 3 completed
                                        </span>
                                        <span className={`font-bold ${isComplete ? "text-green-700" : "text-blue-700"}`}>
                                            {Math.round(((selectedVisaType ? 1 : 0) + (visaPurpose?.trim() ? 1 : 0) + (uploadedDocsCount > 0 ? 1 : 0)) / 3 * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${isComplete
                                                ? "bg-gradient-to-r from-green-500 to-green-600"
                                                : "bg-gradient-to-r from-blue-500 to-blue-600"
                                                }`}
                                            style={{ width: `${((selectedVisaType ? 1 : 0) + (visaPurpose?.trim() ? 1 : 0) + (uploadedDocsCount > 0 ? 1 : 0)) / 3 * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* Action Buttons */}
                <StepButtons
                    onBack={onBack}
                    onNext={submit}
                    nextLabel="Continue to Upload Documents"
                    backLabel="Back to Passport Details"
                    isLoading={isApplicationLoading}
                    disabled={!isComplete}
                />
            </div>
        </div>
    );
}