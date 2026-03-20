import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { loginUser, registerUser, verifyOtp, forgotPassword } from "../../../Redux/Slice/auth/authSlice";
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
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [timer, setTimer] = useState(60);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordTimer, setForgotPasswordTimer] = useState(0);
  const [showForgotPasswordSuccess, setShowForgotPasswordSuccess] = useState(false);

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
            hotToast("Verification code sent to your email", "success");
            setRegisteredEmail(data.email);
            setShowOtp(true);
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

      dispatch(loginUser(auth_obj))
        .then((res) => {
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
              dispatch(updateLastSignInAt({
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

  const handleToggle = () => {
    setIsSignup(!isSignup);
    setShowOtp(false);
    setShowForgotPassword(false);
    setShowForgotPasswordSuccess(false);
    reset();
  };

  React.useEffect(() => {
    let interval;
    if (showOtp && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showOtp, timer]);

  React.useEffect(() => {
    let interval;
    if (showForgotPasswordSuccess && forgotPasswordTimer > 0) {
      interval = setInterval(() => {
        setForgotPasswordTimer((prev) => prev - 1);
      }, 1000);
    } else if (forgotPasswordTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showForgotPasswordSuccess, forgotPasswordTimer]);

  const handleResendOtp = () => {
    dispatch(resendOtp({ email: registeredEmail, type: 'signup' }))
      .then(res => {
        if (res.meta.requestStatus === "fulfilled") {
          hotToast("Verification code resent", "success");
          setTimer(60);
        } else {
          getSweetAlert('Oops...', res.payload, 'info');
        }
      });
  };

  const handleForgotPasswordResend = () => {
    const resetUrl = `${window.location.origin}/reset-password`;
    dispatch(forgotPassword({ email: forgotPasswordEmail, redirectTo: resetUrl }))
      .then(res => {
        if (res.meta.requestStatus === "fulfilled") {
          hotToast("Reset link resent", "success");
          setForgotPasswordTimer(60);
        } else {
          getSweetAlert('Oops...', res.payload, 'info');
        }
      });
  };

  const onVerifyOtp = (data) => {
    dispatch(verifyOtp({ email: registeredEmail, token: data.otp, role: 'embassy' }))
      .then(res => {
        if (res.meta.requestStatus === "fulfilled") {
          toastifyAlert.success('Email Verified Successfully');
          reset();
          setShowOtp(false);
          setIsSignup(false);
        } else {
          getSweetAlert('Oops...', res.payload, 'info');
        }
      });
  };

  const onForgotPasswordSubmit = (data) => {
    const resetUrl = `${window.location.origin}/reset-password`;
    dispatch(forgotPassword({ email: data.email, redirectTo: resetUrl }))
      .then(res => {
        if (res.meta.requestStatus === "fulfilled") {
          hotToast('Password reset link sent to your email', "success");
          setForgotPasswordEmail(data.email);
          setShowForgotPasswordSuccess(true);
          setForgotPasswordTimer(60);
        } else {
          getSweetAlert('Oops...', res.payload, 'info');
        }
      });
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(/Slider1.jpg)` }}
    >
      <div className="w-full h-screen flex shadow-2xl overflow-hidden">
        {/* LEFT VIDEO SECTION */}
        <div className="hidden md:block w-1/2 relative bg-black/80">
          <video autoPlay loop muted playsInline
            poster="/Slider1.jpg"
            className="absolute w-full h-full object-cover top-0 left-0"
          >
            <source src="/signup.mp4" type="video/mp4" />
          </video>

          <div className="relative z-10 text-white h-full px-10 flex flex-col justify-center bg-black/50">
            <h4 className="text-3xl font-bold mb-4">Embassy Portal</h4>
            <p className="text-base mb-6">
              {showOtp ? 'Verify your identity to continue' : showForgotPassword ? 'Reset your access' : isSignup
                ? "Register your embassy to begin visa operations"
                : "Access your embassy dashboard securely"}
            </p>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="w-full md:w-1/2 bg-black/40 backdrop-blur-xl border-l border-white/10 px-8 md:px-12 py-6 md:py-8 flex flex-col justify-center overflow-y-auto md:overflow-visible custom-scrollbar">
          <h4 className=" font-bold mb-5 text-xl sm:text-2xl md:text-3xl text-center sm:text-left">
            {showOtp ? "Verify OTP" : showForgotPassword ? "Reset Password" : isSignup ? "Embassy Sign Up" : "Embassy Sign In"}
          </h4>

          {showOtp ? (
            <form onSubmit={handleSubmit(onVerifyOtp)} className="flex flex-col gap-6">
              <p className="text-white/80 text-sm mb-2 text-center sm:text-left">Please enter the 6-digit code sent to {registeredEmail}</p>
              <EmbassyAuthInputField
                label="OTP Code"
                {...register("otp", {
                  required: "OTP is required",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Enter a valid 6-digit OTP"
                  }
                })}
                error={!!errors.otp}
                helperText={errors.otp?.message}
              />
              <button
                type="submit"
                disabled={isUserAuthLoading}
                className={`py-3 rounded-md font-semibold hover:bg-black/80 transition ${isUserAuthLoading ? 'cursor-not-allowed bg-black/80' : 'cursor-pointer bg-black'}`}
              >
                {isUserAuthLoading && (
                  <div className="w-4 h-4 border-1 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />
                )}
                Verify OTP
              </button>
              <div className="flex flex-col gap-2 items-center">
                <p className="text-white/60 text-xs text-center">
                  Didn't receive the code?{' '}
                  {timer > 0 ? (
                    <span className="text-white font-medium">Resend in {timer}s</span>
                  ) : (
                    <span
                      onClick={handleResendOtp}
                      className="text-white font-bold cursor-pointer hover:underline"
                    >
                      Resend Now
                    </span>
                  )}
                </p>
                <button type="button" onClick={() => setShowOtp(false)} className="text-white/70 hover:text-white text-xs text-center">Back to Sign Up</button>
              </div>
            </form>
          ) : showForgotPassword ? (
            <div className="flex flex-col gap-6">
              {!showForgotPasswordSuccess ? (
                <form onSubmit={handleSubmit(onForgotPasswordSubmit)} className="flex flex-col gap-6">
                  <p className="text-white/80 text-sm mb-2 text-center sm:text-left">Enter your email to receive a password reset link.</p>
                  <EmbassyAuthInputField
                    label="Email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-zA-Z.]{2,}$/,
                        message: "Enter a valid email",
                      },
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                  <button
                    type="submit"
                    disabled={isUserAuthLoading}
                    className={`py-3 rounded-md font-semibold hover:bg-black/80 transition ${isUserAuthLoading ? 'cursor-not-allowed bg-black/80' : 'cursor-pointer bg-black'}`}
                  >
                    {isUserAuthLoading && (
                      <div className="w-4 h-4 border-1 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />
                    )}
                    Send Reset Link
                  </button>
                </form>
              ) : (
                <div className="text-center flex flex-col gap-4 py-4">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-blue-500/30">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Check Your Email</h3>
                  <p className="text-white/70 text-sm italic">Verification Link Sent to:</p>
                  <p className="text-blue-400 font-medium text-sm -mt-2 truncate">{forgotPasswordEmail}</p>

                  <div className="mt-4">
                    {forgotPasswordTimer > 0 ? (
                      <p className="text-white/50 text-xs text-center border-t border-white/10 pt-4">
                        Resend available in <span className="text-white font-medium">{forgotPasswordTimer}s</span>
                      </p>
                    ) : (
                      <button
                        onClick={handleForgotPasswordResend}
                        className="text-white font-bold text-xs hover:text-blue-400 transition-colors uppercase tracking-widest border-b border-white hover:border-blue-400 pb-1"
                      >
                        Resend Reset Link
                      </button>
                    )}
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setShowForgotPasswordSuccess(false);
                }}
                className="text-white/70 hover:text-white text-xs text-center"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <>
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

                <div className="flex flex-col gap-1">
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
                  {!isSignup && (
                    <p
                      onClick={() => {
                        setShowForgotPassword(true);
                        reset();
                      }}
                      className="text-[10px] text-white/60 hover:text-white cursor-pointer transition-colors text-right"
                    >
                      Forgot Password?
                    </p>
                  )}
                </div>

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
                onClick={handleToggle}
              >
                {isSignup
                  ? "Already have an account? Sign In"
                  : "New Embassy? Sign Up"}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmbassyAuth;
