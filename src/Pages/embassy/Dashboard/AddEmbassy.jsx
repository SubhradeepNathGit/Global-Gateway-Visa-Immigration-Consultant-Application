import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../Redux/Slice/auth/authSlice';
import hotToast from '../../../util/alert/hot-toast';
import getSweetAlert from '../../../util/alert/sweetAlert';
import { EmbassyAuthInputField } from '../../../Components/Embassy/auth/EmbassyAuthInputField';

const AddEmbassy = () => {
    const dispatch = useDispatch(),
        { isUserAuthLoading } = useSelector((state) => state.auth),
        { embassyData } = useSelector(state => state.embassy);
    console.log(embassyData);

    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
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

        setValue("embassy_doc", file, { shouldValidate: true });
    };

    const onSubmit = (data) => {
        let auth_obj;

        auth_obj = {
            country_name: embassyData?.country_name?.toLowerCase()?.split(" ")?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))?.join(" "),
            country_id: null,
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
                    getSweetAlert("Oops...", res.payload, "error");
                }
            })
            .catch(() => {
                getSweetAlert("Oops...", "Something went wrong!", "error");
            });
    };

    return (
        <div
            className="min-h-screen flex justify-center items-center px-4 py-8"
            style={{
                backgroundImage: `url(/Slider1.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="w-full max-w-6xl h-[650px] flex shadow-2xl rounded-xl overflow-hidden">

                <div className="w-full bg-black/20 backdrop-blur-md text-white px-12 py-8 flex flex-col justify-center">
                    <h4 className=" font-bold mb-5 text-xl sm:text-2xl md:text-3xl ml-0 sm:ml-6 md:ml-30 text-center sm:text-left">
                        Add New Embassy
                    </h4>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

                        <EmbassyAuthInputField
                            label="Country" disable
                            value={embassyData?.country_name}
                            error={!!errors.country}
                            helperText={errors.country?.message} />

                        {/* DRAG & DROP PDF UPLOAD */}
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragActive(true);
                            }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={handleFileDrop}
                            className={`border-2 border-dashed rounded-md p-6 text-center transition ${dragActive ? "border-white bg-white/10" : "border-white/30"}`}>
                            <input
                                type="file" accept="application/pdf" className="hidden" id="embassyDoc"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setValue("embassy_doc", file, { shouldValidate: true });
                                    }
                                }} />

                            <label
                                htmlFor="embassyDoc"
                                className="cursor-pointer text-sm text-white/80"
                            >
                                {uploadedFile
                                    ? `${uploadedFile.name}`
                                    : "Drag & Drop Embassy Proof (PDF) or click to upload"}
                            </label>

                            <input
                                type="hidden"
                                {...register("embassy_doc", {
                                    required: "Country image is required",
                                    validate: (file) => {
                                        if (!file) return "Country image is required";

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

                            {errors.embassy_doc && (
                                <p className="text-xs text-red-400 mt-2">
                                    {errors.embassy_doc.message}
                                </p>
                            )}
                        </div>


                        <EmbassyAuthInputField
                            label="Email"
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value:
                                        /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-zA-Z.]{2,}$/,
                                    message: "Enter a valid email",
                                },
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />

                        <EmbassyAuthInputField
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            {...register("password", {
                                required: "Password is required",
                                pattern: {
                                    value:
                                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                                    message:
                                        "Password must contain 8+ characters, uppercase, lowercase, number & special character",
                                },
                            })}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />

                        <button
                            type="submit"
                            className={`py-3 rounded-md font-semibold hover:bg-black/80 transition ${isUserAuthLoading ? 'cursor-not-allowed bg-black/80' : 'cursor-pointer bg-black'}`}
                        >
                            {isUserAuthLoading && (
                                <div className="w-4 h-4 border-1 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />
                            )}
                            Add New Embassy
                        </button>
                    </form>

                    <p
                        className="text-xs mt-4 text-white/70 cursor-pointer hover:text-white"
                        onClick={() => setIsSignup(!isSignup)}
                    >
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AddEmbassy