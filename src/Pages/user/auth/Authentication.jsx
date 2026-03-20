import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { loginUser, registerUser, verifyOtp, forgotPassword, resendOtp } from '../../../Redux/Slice/auth/authSlice';
import getSweetAlert from '../../../util/alert/sweetAlert';
import hotToast from '../../../util/alert/hot-toast';
import toastifyAlert from '../../../util/alert/toastify';
import { useNavigate } from 'react-router-dom';
import { updateLastSignInAt } from '../../../Redux/Slice/userSlice';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showOtp, setShowOtp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showForgotPasswordSuccess, setShowForgotPasswordSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [timer, setTimer] = useState(0);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordTimer, setForgotPasswordTimer] = useState(0);
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const { isUserAuthLoading } = useSelector(state => state.auth);

  const { register, handleSubmit, watch, formState: { errors }, reset, clearErrors, setValue } = useForm();
  const navigate = useNavigate();
  const passwordValue = watch("password");

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
    }
  };

  const handleFileChange = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      getSweetAlert('Oops...', 'Only JPG, JPEG, or PNG files are allowed', 'error');
      return;
    }
    if (file.size > 200 * 1024) {
      getSweetAlert('Oops...', 'Maximum file size is 200KB', 'error');
      return;
    }
    setSelectedFile(file);

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    setValue('avatar', dataTransfer.files);
  };

  const onFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const onSubmit = (data) => {
    let auth_obj;
    if (isLogin) {
      auth_obj = {
        email: data.email,
        password: data.password,
        role: 'user'
      };

      dispatch(loginUser(auth_obj))
        .then(res => {
          if (res.meta.requestStatus === "fulfilled") {
            sessionStorage.setItem('user_token', res.payload.accessToken);

            dispatch(updateLastSignInAt({ id: res?.payload?.user?.id, user_type: 'user' }))
              .then(res => {
                if (res.meta.requestStatus === "fulfilled") {
                  toastifyAlert.success('Logged In Successfully');
                  navigate('/dashboard');
                } else {
                  getSweetAlert('Oops...', res.payload, 'info');
                }
              })
              .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
              });
          } else {
            getSweetAlert('Oops...', res.payload, 'info');
          }
        })
        .catch(err => {
          console.log('Error occured', err);
          getSweetAlert('Oops...', 'Something went wrong!', 'error');
        });
    } else {
      auth_obj = {
        name: data.name?.split(" ")?.map(char => char?.charAt(0)?.toUpperCase() + char?.slice(1))?.join(" "),
        country: data.country?.charAt(0)?.toUpperCase() + data.country?.slice(1),
        email: data.email,
        avatar: data.avatar,
        password: data.password,
        is_verified: "pending",
        is_blocked: false,
        last_sign_in_at: null,
        has_purchase_course: false,
        role: "user"
      };

      dispatch(registerUser(auth_obj))
        .then(res => {
          if (res.meta.requestStatus === "fulfilled") {
            hotToast('Verification code sent to your email', "success");
            setRegisteredEmail(data.email);
            setShowOtp(true);
            setTimer(60);
          } else {
            getSweetAlert('Oops...', res.payload, 'info');
          }
        })
        .catch(err => {
          console.log('Error occured', err);
          getSweetAlert('Oops...', 'Something went wrong!', 'error');
        });
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setShowOtp(false);
    setShowForgotPassword(false);
    setShowForgotPasswordSuccess(false);
    reset();
    clearErrors();
    setSelectedFile(null);
  };

  useEffect(() => {
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

  useEffect(() => {
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

  const onVerifyOtp = (data) => {
    dispatch(verifyOtp({ email: registeredEmail, token: data.otp, role: 'user' }))
      .then(res => {
        if (res.meta.requestStatus === "fulfilled") {
          toastifyAlert.success('Email Verified Successfully');
          reset();
          setShowOtp(false);
          setIsLogin(true);
        } else {
          getSweetAlert('Oops...', res.payload, 'info');
        }
      });
  };

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

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center overflow-hidden"
      style={{ backgroundImage: 'url(/Slider1.jpg)' }}
    >
      <div className="w-full h-screen flex flex-col md:flex-row shadow-2xl overflow-hidden">

        {/* LEFT VIDEO SECTION */}
        <div className="w-full md:w-1/2 relative bg-black/80 h-[300px] md:h-full">
          <video autoPlay loop muted playsInline
            preload="auto"
            poster="/Slider1.jpg"
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src="/signup.mp4" type="video/mp4" />
          </video>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/75 via-black/50 to-transparent z-10" />

          {/* Brand name — top left of left panel */}
          <div className="absolute top-8 left-8 z-20 flex items-center gap-2">
            <FlightTakeoffIcon className="text-white text-[30px]" />
            <span className="text-white font-bold text-[22px] tracking-wide">Global Gateway</span>
          </div>

          {/* Left content — centered */}
          <div className="relative z-10 h-full flex flex-col justify-center items-center px-8 md:px-12 py-12 md:py-0 text-center">
            <div className="max-w-md">
              <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold mb-4 tracking-tight text-white/50 leading-tight">
                {isLogin ? 'Welcome Back' : 'Hello, Traveller!'}
              </h2>

              <p className="text-sm md:text-base mb-6 -mt-2 text-white/70 leading-relaxed font-medium">
                {isLogin
                  ? 'Sign in to continue your journey with us'
                  : 'Enter your details to join Global Gateway '}
              </p>

              <button
                onClick={handleToggle}
                className="px-30 py-2.5 border-2 border-white/50 text-white rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-300 font-bold text-sm tracking-widest uppercase backdrop-blur-sm"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="w-full md:w-1/2 h-[300px] md:h-full bg-black/45 backdrop-blur-md border-l border-white/10 overflow-hidden">

          <div className="h-full overflow-y-auto auth-scrollbar flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto px-2 md:px-2 py-6">

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {showOtp ? 'Verify Email' : showForgotPassword ? 'Reset Password' : isLogin ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-white/40 text-xs mb-5">
                {showOtp ? 'Enter the 6-digit code we sent you'
                  : showForgotPassword ? 'We\'ll send a reset link to your email'
                    : isLogin ? 'Access your Global Gateway account'
                      : 'Start your journey with Global Gateway'}
              </p>

              {showOtp ? (
                <form onSubmit={handleSubmit(onVerifyOtp)} className="flex flex-col gap-3">
                  <p className="text-white/70 text-xs mb-1">Please enter the 6-digit code sent to <span className="text-white font-medium">{registeredEmail}</span></p>
                  <div className="flex flex-col">
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
                      className={`w-full px-3 py-3 text-sm bg-white/10 backdrop-blur-sm border rounded-full focus:outline-none transition-colors text-white placeholder-white/40 ${errors.otp ? 'border-red-500' : 'border-white/20 focus:border-white/60'}`}
                    />
                    {errors.otp && <span className="text-red-400 text-xs mt-1">{errors.otp.message}</span>}
                  </div>
                  <button
                    type="submit"
                    disabled={isUserAuthLoading}
                    className="w-full py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 bg-transparent border border-white/30 hover:bg-black text-white uppercase tracking-wider transition-all"
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

                      <div className="flex flex-col">
                        <label className="text-xs font-medium text-white/70 mb-1">Email address</label>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-zA-Z.]{2,}$/,
                              message: "Enter a valid email"
                            }
                          })}
                          className={`w-full px-3 py-3 text-sm bg-white/10 backdrop-blur-sm border rounded-full focus:outline-none transition-colors text-white placeholder-white/40 ${errors.email ? 'border-red-500' : 'border-white/20 focus:border-white/60'}`}
                        />
                        {errors.email && <span className="text-red-400 text-xs mt-0.5">{errors.email.message}</span>}
                      </div>
                      <button
                        type="submit"
                        disabled={isUserAuthLoading}
                        className="w-full py-2.5 mt-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2 bg-transparent border border-white/30 hover:bg-black text-white uppercase tracking-wider transition-all"
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
                      <h3 className="text-base  font-bold text-white">Check your email</h3>
                      <p className="text-white/60 text-xs">Reset link sent to <span className="text-white font-medium">{forgotPasswordEmail}</span></p>
                      <p className="text-white/50 text-xs">
                        Didn't receive it?{' '}
                        {forgotPasswordTimer > 0 ? (
                          <span className="text-white/80 font-medium">Resend in {forgotPasswordTimer}s</span>
                        ) : (
                          <span onClick={handleForgotPasswordResend} className="text-blue-400 font-semibold cursor-pointer hover:text-blue-300 transition-colors">Resend Link</span>
                        )}
                      </p>
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
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-3"
                  >
                    {!isLogin && (
                      <>
                        <div className="flex gap-3">
                          <div className="flex flex-col flex-1">
                            <label className="text-xs font-medium text-white/70 mb-1">Full Name</label>
                            <input
                              type="text"
                              placeholder="Full name"
                              {...register("name", { required: "Name is required" })}
                              className={`w-full px-3 py-3 text-sm bg-white/10 backdrop-blur-sm border rounded-full focus:outline-none transition-colors text-white placeholder-white/40 ${errors.name ? 'border-red-500' : 'border-white/20 focus:border-white/60'}`}
                            />
                            {errors.name && <span className="text-red-400 text-xs mt-0.5">{errors.name.message}</span>}
                          </div>
                          <div className="flex flex-col flex-1">
                            <label className="text-xs font-medium text-white/70 mb-1">Country</label>
                            <input
                              type="text"
                              placeholder="Country"
                              {...register("country", { required: "Country is required" })}
                              className={`w-full px-3 py-3 text-sm bg-white/10 backdrop-blur-sm border rounded-full focus:outline-none transition-colors text-white placeholder-white/40 ${errors.country ? 'border-red-500' : 'border-white/20 focus:border-white/60'}`}
                            />
                            {errors.country && <span className="text-red-400 text-xs mt-0.5">{errors.country.message}</span>}
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <label className="text-xs font-medium text-white/70 mb-1">Profile Picture</label>
                          <div
                            className={`relative border border-dashed rounded-2xl  p-3 transition-all h-[80px] flex items-center ${dragActive ? 'border-blue-400 bg-blue-500/20' : errors.avatar ? 'border-red-400 bg-red-500/20' : 'border-white/20 bg-white/5 hover:border-white/40'}`}
                            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                            <input
                              type="file"
                              accept="image/*"
                              {...(() => {
                                const { ref, onChange, ...rest } = register("avatar", {
                                  validate: {
                                    fileType: (value) => {
                                      if (!value || !value[0]) return "File is required";
                                      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
                                      return allowedTypes.includes(value[0].type) ? true : "Only JPG, JPEG, or PNG files are allowed";
                                    },
                                    fileSize: (value) => value && value[0]?.size < 200 * 1024 ? true : "Maximum file size is 200KB",
                                  }
                                });
                                return {
                                  ...rest,
                                  ref: (e) => { ref(e); fileInputRef.current = e; },
                                  onChange: (e) => { onChange(e); onFileInputChange(e); }
                                };
                              })()}
                              className="hidden"
                            />
                            <div className="w-full text-center">
                              {selectedFile ? (
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full overflow-hidden border border-white/30 flex-shrink-0">
                                    <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" onLoad={(e) => URL.revokeObjectURL(e.target.src)} />
                                  </div>
                                  <div className="text-left overflow-hidden">
                                    <p className="text-xs font-semibold text-white truncate max-w-[200px]">{selectedFile.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded text-white/60 font-bold uppercase">
                                        {selectedFile.type.split('/')[1].replace('jpeg', 'jpg')}
                                      </span>
                                      <span className="text-[10px] text-white/40 font-medium">
                                        {(selectedFile.size / 1024).toFixed(1)} KB
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <svg className="mx-auto h-7 w-7 text-white/40" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                  <p className="mt-1 text-xs text-white/60 font-medium">
                                    <span className="text-blue-400 cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>Click to upload</span> or drag and drop
                                  </p>
                                </>
                              )}
                            </div>
                            {selectedFile && (
                              <button type="button" onClick={() => { setSelectedFile(null); setValue('avatar', null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute top-1/2 -translate-y-1/2 right-3 text-white/40 hover:text-white transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          {errors.avatar && <span className="text-red-400 text-xs mt-0.5">{errors.avatar.message}</span>}
                        </div>
                      </>
                    )}

                    <div className="flex flex-col">
                      <label className="text-xs font-medium text-white/70 mb-1">Email</label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-zA-Z.]{2,}$/,
                            message: "Enter a valid email",
                          }
                        })}
                        className={`w-full px-3 py-3 text-sm bg-white/10 backdrop-blur-sm border rounded-full focus:outline-none transition-colors text-white placeholder-white/40 ${errors.email ? 'border-red-500' : 'border-white/20 focus:border-white/60'}`}
                      />
                      {errors.email && <span className="text-red-400 text-xs mt-0.5">{errors.email.message}</span>}
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs font-medium text-white/70 mb-1">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          {...register("password", {
                            required: "Password is required",
                            ...(!isLogin && {
                              pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                                message:
                                  "8+ chars, uppercase, lowercase, number & special character",
                              }
                            })
                          })}
                          className={`w-full px-3 py-3 text-sm bg-white/10 backdrop-blur-sm border rounded-full focus:outline-none transition-colors pr-10 text-white placeholder-white/40 ${errors.password ? 'border-red-500' : 'border-white/20 focus:border-white/60'}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                        >
                          {showPassword ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.password && <span className="text-red-400 text-xs mt-0.5">{errors.password.message}</span>}
                    </div>

                    {!isLogin && (
                      <div className="flex flex-col">
                        <label className="text-xs font-medium text-white/70 mb-1">Confirm Password</label>
                        <div className="relative">
                          <input
                            type="password"
                            placeholder="Confirm your password"
                            {...register("confirm_password", {
                              required: "Confirm password is required",
                              validate: (value) =>
                                value === passwordValue || "Passwords do not match",
                            })}
                            className={`w-full px-3 py-3 text-sm bg-white/10 backdrop-blur-sm border rounded-full focus:outline-none transition-colors pr-10 text-white placeholder-white/40 ${errors.confirm_password ? 'border-red-500' : 'border-white/20 focus:border-white/60'}`}
                          />
                        </div>
                        {errors.confirm_password && <span className="text-red-400 text-xs mt-0.5">{errors.confirm_password.message}</span>}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isUserAuthLoading}
                      className={`w-full py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 uppercase tracking-wider mt-1 ${isUserAuthLoading
                        ? 'bg-white/10 cursor-not-allowed text-white/40'
                        : 'bg-transparent border border-white/30 hover:bg-black text-white hover:border-transparent cursor-pointer'
                        }`}
                    >
                      {isUserAuthLoading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                      {isLogin ? "Sign In" : "Sign Up"}
                    </button>
                  </form>

                  {isLogin && (
                    <p
                      onClick={() => {
                        setShowForgotPassword(true);
                        reset();
                      }}
                      className="text-xs mt-2 text-white/50 hover:text-white cursor-pointer transition-colors text-right">
                      Forgot your password?
                    </p>
                  )}
                </>
              )}

              {!showOtp && !showForgotPassword && (
                <p className="text-[13px] text-white/50 mt-6 text-center font-medium">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button onClick={handleToggle} className="font-semibold text-white/50 hover:text-blue-400 transition-colors">
                    {isLogin ? 'Create account' : 'Sign in'}
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
