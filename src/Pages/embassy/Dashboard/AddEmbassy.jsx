import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../Redux/Slice/auth/authSlice';
import hotToast from '../../../util/alert/hot-toast';
import getSweetAlert from '../../../util/alert/sweetAlert';
import { 
    Building2, 
    UploadCloud, 
    FileText, 
    CheckCircle2, 
    Eye, 
    EyeOff, 
    Lock, 
    Mail, 
    Globe, 
    X,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';

const AddEmbassy = () => {
    const dispatch = useDispatch();
    const { isUserAuthLoading } = useSelector((state) => state.auth);
    const { embassyData } = useSelector((state) => state.embassy);

    const [showPassword, setShowPassword] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm({
        mode: "onTouched",
        defaultValues: {
            email: "",
            password: "",
            embassy_doc: null,
        },
    });

    const uploadedFile = watch("embassy_doc");

    const handleFileDrop = (e) => {
        e.preventDefault();
        setDragActive(false);

        const file = e.dataTransfer.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            getSweetAlert("Invalid File", "Only PDF files are allowed", "warning");
            return;
        }

        if (file.size > 200 * 1024) {
            getSweetAlert("File Too Large", "Maximum file size is 200 KB", "warning");
            return;
        }

        setValue("embassy_doc", file, { shouldValidate: true });
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== "application/pdf") {
                getSweetAlert("Invalid File", "Only PDF files are allowed", "warning");
                return;
            }
            if (file.size > 200 * 1024) {
                getSweetAlert("File Too Large", "Maximum file size is 200 KB", "warning");
                return;
            }
            setValue("embassy_doc", file, { shouldValidate: true });
        }
    };

    const removeFile = (e) => {
        e.stopPropagation();
        setValue("embassy_doc", null, { shouldValidate: true });
    };

    const onSubmit = (data) => {
        const formattedCountryName = embassyData?.country_name
            ?.toLowerCase()
            ?.split(" ")
            ?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
            ?.join(" ");

        const auth_obj = {
            country_name: formattedCountryName || "Unknown",
            country_id: embassyData?.country_id || null,
            email: data.email,
            password: data.password,
            embassy_doc: data.embassy_doc,
            is_verified: "pending",
            is_country_available: false,
            is_blocked: false,
            is_approved: "pending",
            is_country_listed: false,
            last_sign_in_at: null,
            providers: null,
            role: "embassy",
        };

        dispatch(registerUser(auth_obj))
            .then((res) => {
                if (res.meta.requestStatus === "fulfilled") {
                    hotToast(
                        "New embassy added successfully. Please verify the email",
                        "success"
                    );
                    reset();
                } else {
                    getSweetAlert("Oops...", res.payload || "Failed to add embassy", "error");
                }
            })
            .catch(() => {
                getSweetAlert("Oops...", "Something went wrong!", "error");
            });
    };

    return (
        <div className="w-full bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden">
            {/* Header Section */}
            <div className="px-6 py-6 sm:px-8 md:px-10 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-gray-900 text-white rounded-xl shadow-xs">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                            Add New Embassy
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            Register official credentials and upload verification documents for embassy personnel
                        </p>
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 self-start sm:self-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Verification Required
                </div>
            </div>

            {/* Form Content */}
            <div className="p-6 sm:p-8 md:p-10">
                <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
                    {/* Top 3 Input Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Assigned Country */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-800">
                                Assigned Country
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Globe className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    disabled
                                    value={embassyData?.country_name || "South Africa"}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium cursor-not-allowed text-sm"
                                />
                            </div>
                            <p className="text-xs text-gray-400">
                                Automatically locked to your embassy jurisdiction.
                            </p>
                        </div>

                        {/* Official Embassy Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
                                Official Embassy Email <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="embassy.official@domain.gov"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-zA-Z.]{2,}$/,
                                            message: "Please enter a valid email address",
                                        },
                                    })}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white border text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 ${
                                        errors.email
                                            ? "border-red-300 focus:ring-red-200"
                                            : "border-gray-200 focus:ring-black/10 focus:border-gray-900"
                                    }`}
                                />
                            </div>
                            {errors.email ? (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {errors.email.message}
                                </p>
                            ) : (
                                <p className="text-xs text-gray-400">
                                    Credentials will be dispatched to this address.
                                </p>
                            )}
                        </div>

                        {/* Account Password */}
                        <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
                                Account Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter secure password"
                                    {...register("password", {
                                        required: "Password is required",
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                                            message: "8+ chars with upper, lower, number & symbol",
                                        },
                                    })}
                                    className={`w-full pl-10 pr-11 py-3 rounded-xl bg-white border text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 ${
                                        errors.password
                                            ? "border-red-300 focus:ring-red-200"
                                            : "border-gray-200 focus:ring-black/10 focus:border-gray-900"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700 transition cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password ? (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {errors.password.message}
                                </p>
                            ) : (
                                <p className="text-xs text-gray-400">
                                    8+ characters with uppercase, number & symbol.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Full-Width Drag & Drop PDF Upload Area */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                            Embassy Proof Document (PDF) <span className="text-red-500">*</span>
                        </label>

                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragActive(true);
                            }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={handleFileDrop}
                            onClick={() => document.getElementById("embassyDoc")?.click()}
                            className={`w-full border-2 border-dashed rounded-2xl py-10 px-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3.5 ${
                                dragActive
                                    ? "border-gray-900 bg-gray-50"
                                    : uploadedFile
                                    ? "border-emerald-300 bg-emerald-50/20"
                                    : "border-gray-300 hover:border-gray-400 bg-gray-50/40 hover:bg-gray-50/80"
                            }`}
                        >
                            <input
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                id="embassyDoc"
                                onChange={handleFileInput}
                            />

                            {uploadedFile ? (
                                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-xs max-w-lg w-full">
                                    <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {uploadedFile.name}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {(uploadedFile.size / 1024).toFixed(1)} KB • PDF Document
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="p-1 text-emerald-600 bg-emerald-50 rounded-full">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </span>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="p-1.5 text-gray-400 hover:text-red-500 transition rounded-full hover:bg-gray-100 cursor-pointer"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="p-3.5 bg-white text-gray-700 rounded-full border border-gray-200 shadow-xs">
                                        <UploadCloud className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-gray-800">
                                            Click to upload or drag & drop embassy authorization proof
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Official authorization letter or proof document (PDF only, maximum 200 KB)
                                        </p>
                                    </div>
                                </>
                            )}

                            <input
                                type="hidden"
                                {...register("embassy_doc", {
                                    required: "Embassy proof document is required",
                                    validate: (file) => {
                                        if (!file) return "Embassy proof document is required";
                                        if (!file.type?.match(/application\/pdf/)) {
                                            return "Only PDF files are allowed";
                                        }
                                        if (file.size > 200 * 1024) {
                                            return "Maximum file size is 200 KB";
                                        }
                                        return true;
                                    },
                                })}
                            />
                        </div>

                        {errors.embassy_doc && (
                            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {errors.embassy_doc.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isUserAuthLoading}
                            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-black hover:bg-gray-800 transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer text-sm sm:text-base ${
                                isUserAuthLoading ? "opacity-75 cursor-not-allowed" : ""
                            }`}
                        >
                            {isUserAuthLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Registering Embassy...</span>
                                </>
                            ) : (
                                <>
                                    <Building2 className="w-4 h-4" />
                                    <span>Add New Embassy</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmbassy;