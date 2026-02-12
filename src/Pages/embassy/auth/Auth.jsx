import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { loginUser, registerUser } from "../../../Redux/Slice/auth/authSlice";
import getSweetAlert from "../../../util/alert/sweetAlert";
import { updateLastSignInAt } from "../../../Redux/Slice/userSlice";
import toastifyAlert from "../../../util/alert/toastify";
import { useDispatch, useSelector } from "react-redux";
import { EmbassyAuthInputField } from "../../../Components/Embassy/auth/EmbassyAuthInputField";
import hotToast from "../../../util/alert/hot-toast";
import { useNavigate } from "react-router-dom";
import { encodeBase64Url } from "../../../util/encodeDecode/base64";

const EmbassyAuth = () => {
  const dispatch = useDispatch(),
    navigate = useNavigate(),
    { isUserAuthLoading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      country: "",
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

    if (isSignup) {
      auth_obj = {
        country_name: data?.country?.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
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
              "Registration successful. Please verify your email",
              "success"
            );
            reset();
            setIsSignup(false);
          } else {
            getSweetAlert("Oops...", res.payload, "error");
          }
        })
        .catch(() => {
          getSweetAlert("Oops...", "Something went wrong!", "error");
        });
    }
    else {
      auth_obj = {
        email: data.email,
        password: data.password,
        role: "embassy",
      };
      // console.log('auth', auth_obj);

      dispatch(loginUser(auth_obj))
        .then((res) => {
          // console.log('Response for logged in', res);

          if (res.meta.requestStatus === "fulfilled") {
            sessionStorage.setItem("embassy_token", res.payload.accessToken);

            const redirectPath = !res?.payload?.user?.is_country_available ? 'countrySetup' : res?.payload?.user?.is_approved === "pending" ? 'review' :
              res?.payload?.user?.is_approved === "rejected" ? 'reject' : 'approved';

            if (res?.payload?.user?.address == null || res?.payload?.user?.ending_hours == null || res?.payload?.user?.starting_hours == null) {
              navigate(`/embassy/contact-setup/${encodeBase64Url(String(res?.payload?.user?.email))}/${encodeBase64Url(redirectPath)}`);
            } else if (!res?.payload?.user?.is_country_available) {
              navigate("/embassy/country-setup");
            } else if (res?.payload?.user?.is_approved === "pending") {
              navigate("/embassy/review");
            } else if (res?.payload?.user?.is_approved === "rejected") {
              navigate("/embassy/reject");
            } else if (res?.payload?.user?.last_sign_in_at == null) {
              navigate("/embassy/approved");
            } else {
              dispatch( updateLastSignInAt({
                  id: res?.payload?.user?.id,
                  user_type: "embassy",
                })).then((res) => {
                if (res.meta.requestStatus === "fulfilled") {
                  toastifyAlert.success('Logged in Successfully');
                  navigate("/embassy/dashboard");
                }
                else {
                  getSweetAlert("Oops...", res.payload, "info");
                }
              })
                .catch(() => {
                  getSweetAlert("Oops...", "Something went wrong!", "error");
                })
            }
          }
          else {
            getSweetAlert("Oops...", res.payload, "info");
          }
        })
        .catch(() => {
          getSweetAlert("Oops...", "Something went wrong!", "error");
        });
    }
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
        {/* LEFT VIDEO SECTION */}
        <div className="hidden md:block w-1/2 relative bg-black/80">
          <video autoPlay loop muted playsInline
            className="absolute w-full h-full object-cover top-0 left-0"
          >
            <source src="/signup.mp4" type="video/mp4" />
          </video>

          <div className="relative z-10 text-white h-full px-10 flex flex-col justify-center bg-black/50">
            <h4 className="text-3xl font-bold mb-4">Embassy Portal</h4>
            <p className="text-base mb-6">
              {isSignup
                ? "Register your embassy to begin visa operations"
                : "Access your embassy dashboard securely"}
            </p>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="w-full md:w-1/2 bg-black/20 backdrop-blur-md text-white px-12 py-8 flex flex-col justify-center">
          <h4 className=" font-bold mb-5 text-xl sm:text-2xl md:text-3xl ml-0 sm:ml-6 md:ml-30 text-center sm:text-left">
            {isSignup ? "Embassy Sign Up" : "Embassy Sign In"}
          </h4>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {isSignup && (
              <>
                <EmbassyAuthInputField
                  label="Country"
                  {...register("country", {
                    required: "Country is required",
                  })}
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
              </>
            )}

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
              {isSignup ? "SIGN UP" : "SIGN IN"}
            </button>
          </form>

          <p
            className="text-xs mt-4 text-white/70 cursor-pointer hover:text-white"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup
              ? "Already have an account? Sign In"
              : "New Embassy? Sign Up"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmbassyAuth;
