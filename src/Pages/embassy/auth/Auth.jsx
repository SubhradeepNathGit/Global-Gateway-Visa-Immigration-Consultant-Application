import React, { useState } from "react";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { useForm } from "react-hook-form";
import { loginUser, registerUser, verifyOtp, forgotPassword, resendOtp } from "../../../Redux/Slice/auth/authSlice";
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
  const [showOtp, setShowOtp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
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
      className="min-h-screen bg-cover bg-center flex justify-center items-center overflow-hidden"
      style={{ backgroundImage: 'url(/Slider1.jpg)' }}
    >
      <div className="w-full h-screen flex flex-col md:flex-row-reverse shadow-2xl overflow-hidden relative">
        {/* Brand name — top left of entire container */}
        <div className="absolute top-10 left-10 z-30 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
            <FlightTakeoffIcon className="text-white text-[24px]" />
          </div>
          <span className="text-white font-bold text-xl tracking-wide">Global Gateway</span>
        </div>

        {/* LEFT VIDEO SECTION */}
        <div className="w-full md:w-1/2 relative bg-black/80 h-[300px] md:h-full border-l border-white/10">
          <video
            key={isSignup ? 'embassy-signup' : 'embassy-login'}
            autoPlay loop muted playsInline
            preload="auto"
            poster={isSignup ? "/embassy1.png" : "/embassy2.png"}
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src={isSignup ? "/embassy-signin.mp4" : "/embassy-signup.mp4"} type="video/mp4" />
          </video>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-l from-black/75 via-black/50 to-transparent z-10" />

          {/* Left content — centered */}
          <div className="relative z-10 h-full flex flex-col justify-center items-center px-8 md:px-12 py-12 md:py-0 text-center">
            <div className="max-w-md">
              <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold mb-4 tracking-tight text-white/50 leading-tight">
                Embassy Access
              </h2>

              <p className="text-sm md:text-base mb-6 -mt-2 text-white/70 leading-relaxed font-medium">
                {showOtp ? 'Verify your identity to continue' : showForgotPassword ? 'Reset your access' : isSignup
                  ? "Register your embassy for official diplomatic visa processing"
                  : "Secure portal for diplomatic visa operations"}
              </p>

              <button
                onClick={handleToggle}
                className="px-30 py-3 border-2 border-white/50 text-white rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-300 font-bold text-sm tracking-widest uppercase backdrop-blur-sm"
              >
                {isSignup ? 'Sign In' : 'Register Embassy'}
              </button>
            </div>
          </div>

          {/* Regulatory Notice — full-width bottom of video panel */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/40 backdrop-blur-xs  p-6">
            <p className="text-[10px] text-white/50 md:text-left text-center leading-relaxed">
              <span className="text-[11px] font-bold text-white/80 uppercase block mb-1 md:inline-block md:mr-2 not-italic tracking-[0.1em]">Regulatory Notice</span>
              Official registrations undergo a manual security audit. Documentation must be a valid, government-issued diplomatic credentials.
            </p>
          </div>
        </div>

        {/* RIGHT FORM SECTION (Rendered on Left due to flex-row-reverse) */}
        <div className="w-full md:w-1/2 h-full bg-black/45 backdrop-blur-sm overflow-hidden">

          <div className="h-full overflow-y-auto auth-scrollbar flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto px-4 md:px-8 py-6">

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 mt-8 md:mt-10 tracking-tight">
                {showOtp ? "Verify OTP" : showForgotPassword ? "Reset Password" : isSignup ? "Register New Embassy " : "Sign in to Embassy "}
              </h2>
              <p className="text-white/40 text-xs mb-5">
                {showOtp ? 'Enter the 6-digit code we sent you'
                  : showForgotPassword ? 'We\'ll send a reset link to your email'
                    : isSignup ? 'Official Diplomatic Registration Requested'
                      : 'Secure Diplomatic Gateway'}
              </p>

          {showOtp ? (
            <form onSubmit={handleSubmit(onVerifyOtp)} className="flex flex-col gap-3">
              <p className="text-white/70 text-xs mb-1">Please enter the 6-digit code sent to <span className="text-white font-medium">{registeredEmail}</span></p>
              <div className="flex flex-col text-left">
                <label className="text-xs font-medium text-white/70 mb-1">OTP Code</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  {...register("otp", {
                    required: "OTP is required",
                    pattern: {
                      value: /^\d{6}$/,
                      message: "Enter a valid 6-digit OTP"
                    }
                  })}
                  className={`w-full px-3 py-3.5 text-sm bg-white/10 backdrop-blur-sm border rounded-full focus:outline-none transition-colors text-white placeholder-white/40 ${errors.otp ? 'border-red-500' : 'border-white/20 focus:border-white/60'}`}
                />
                {errors.otp && <span className="text-red-400 text-xs mt-1">{errors.otp.message}</span>}
              </div>
              <button
                type="submit"
                disabled={isUserAuthLoading}
                className="w-full py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2 bg-transparent border border-white/30 hover:bg-black text-white uppercase tracking-wider transition-all"
              >
                {isUserAuthLoading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                Verify OTP
              </button>
              <div className="flex flex-col gap-1 items-center">
                <p className="text-white/50 text-xs">
                  Didn't receive the code?{' '}
                  {timer > 0 ? (
                    <span className="text-white/80 font-medium">Resend in {timer}s</span>
                  ) : (
                    <span onClick={handleResendOtp} className="text-blue-400 font-semibold cursor-pointer hover:text-blue-300 transition-colors">Resend Code</span>
                  )}
                </p>
                <button type="button" onClick={() => setShowOtp(false)} className="text-white/50 hover:text-white text-xs text-center transition-colors">Back to Sign Up</button>
              </div>
            </form>
          ) : showForgotPassword ? (
            <div className="flex flex-col gap-3">
              {!showForgotPasswordSuccess ? (
                <form onSubmit={handleSubmit(onForgotPasswordSubmit)} className="flex flex-col gap-3">
                  <p className="text-white/70 text-xs mb-1 text-center sm:text-left">Enter your email to receive a password reset link.</p>
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
                    className="w-full py-3 mt-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2 bg-transparent border border-white/30 hover:bg-black text-white uppercase tracking-wider transition-all"
                  >
                    {isUserAuthLoading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                    Send Reset Link
                  </button>
                </form>
              ) : (
                <div className="text-center mt-5 flex flex-col gap-3 py-2">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-white">Check your email</h3>
                  <p className="text-white/60 text-xs">Reset link sent to <span className="text-white font-medium">{forgotPasswordEmail}</span></p>
                  <p className="text-white/50 text-xs">
                    Didn't receive it?{' '}
                    {forgotPasswordTimer > 0 ? (
                      <span className="text-white/80 font-medium">Resend in {forgotPasswordTimer}s</span>
                    ) : (
                      <span onClick={handleForgotPasswordResend} className="text-blue-400 font-semibold cursor-pointer hover:text-blue-300 transition-colors">Resend Link</span>
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setShowForgotPasswordSuccess(false);
                    }}
                    className="w-full py-3 mt-4 rounded-full text-sm font-semibold bg-white/10 border border-white/20 text-white hover:bg-black transition-all uppercase tracking-wider"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setShowForgotPasswordSuccess(false);
                    }}
                    className="text-white/50 hover:text-white text-xs text-center transition-colors -mt-2"
                  >
                    Back to Login
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setShowForgotPasswordSuccess(false);
                }}
                className="text-white/50 hover:text-white text-xs text-center transition-colors"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
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
                    <div className="flex flex-col">
                      <label className="text-xs font-medium text-white/70 mb-1">Embassy Proof</label>
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragActive(true);
                          }}
                          onDragLeave={() => setDragActive(false)}
                          onDrop={handleFileDrop}
                          className={`relative border-2 border-dashed rounded-3xl p-4 transition-all h-[100px] flex items-center justify-center ${dragActive ? 'border-blue-500 bg-blue-500/10' : errors.embassy_doc ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                        >
                        <input
                          type="file" accept="application/pdf" className="hidden" id="embassyDoc"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setValue("embassy_doc", file, { shouldValidate: true });
                            }
                          }} />

                        <div className="w-full text-center">
                          <label
                            htmlFor="embassyDoc"
                            className="cursor-pointer text-xs text-white/60 font-medium"
                          >
                            {uploadedFile ? (
                              <div className="flex items-center justify-center gap-2">
                                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                                </svg>
                                <span className="text-white truncate max-w-[200px]">{uploadedFile.name}</span>
                              </div>
                            ) : (
                              <>
                                <svg className="mx-auto h-7 w-7 text-white/40 mb-1" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p><span className="text-blue-400 hover:underline">Click to upload</span> or drag and drop PDF</p>
                              </>
                            )}
                          </label>
                        </div>

                        <input
                          type="hidden"
                          {...register("embassy_doc", {
                            required: "Embassy proof is required",
                            validate: (file) => {
                              if (!file) return "Embassy proof is required";
                              if (!file.type?.match(/application\/pdf/)) return "Only PDF files are allowed";
                              if (file.size > 200 * 1024) return "Maximum file size is 200 KB";
                              return true;
                            },
                          })}
                        />
                      </div>
                      {errors.embassy_doc && <span className="text-red-400 text-xs mt-0.5">{errors.embassy_doc.message}</span>}
                    </div>
                  </>
                )}

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

                <div className="flex flex-col gap-1">
                  <EmbassyAuthInputField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                        message: "Password must contain 8+ characters, uppercase, lowercase, number & special character",
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
                      className="text-xs mt-2 text-white/50 hover:text-white cursor-pointer transition-colors text-right"
                    >
                      Forgot your password?
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isUserAuthLoading}
                  className={`w-full py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 uppercase tracking-wider mt-1 ${isUserAuthLoading
                    ? 'bg-white/10 cursor-not-allowed text-white/40'
                    : 'bg-transparent border border-white/30 hover:bg-black text-white hover:border-transparent cursor-pointer'
                    }`}
                >
                  {isUserAuthLoading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                  {isSignup ? "Request Registration" : "Portal Login"}
                </button>
              </form>

              {!showOtp && !showForgotPassword && (
                <p className="text-[13px] text-white/50 mt-6 text-center font-medium">
                  {isSignup ? "Already registered? " : "Official Embassy? "}
                  <button onClick={handleToggle} className="font-semibold text-white/50 hover:text-blue-400 transition-colors">
                    {isSignup ? 'Login to Embassy ' : 'Request Access'}
                  </button>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default EmbassyAuth;
