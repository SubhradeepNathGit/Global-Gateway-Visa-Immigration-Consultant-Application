import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';
import { loginUser, registerUser } from '../../../Redux/Slice/auth/authSlice';
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

    // Create a FileList-like object
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
        phone: data.phone,
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
            hotToast('Registration successfull. Please verify your email', "success");
            reset();
            setSelectedFile(null);
            setIsLogin(!isLogin);
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
    reset();
    clearErrors();
    setSelectedFile(null);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center px-4 py-8"
      style={{ backgroundImage: 'url(/Slider1.jpg)' }}
    >
      <div className="w-full max-w-[1000px] h-[600px] flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden">

        {/* LEFT VIDEO SECTION */}
        <div className="w-full md:w-1/2 relative bg-black/80 h-[300px] md:h-full">
          <video autoPlay loop muted playsInline
            preload="auto"
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src="/signup.mp4" type="video/mp4" />
          </video>

          <div className="relative z-10 text-white h-full px-8 md:px-12 py-12 md:py-0 flex flex-col justify-center bg-gradient-to-b md:bg-gradient-to-r from-black/70 via-black/50 to-transparent">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              {isLogin ? 'Welcome Back!' : 'Hello, Traveller!'}
            </h2>

            <p className="text-sm md:text-base mb-8 opacity-90 leading-relaxed">
              {isLogin
                ? 'Sign in to continue your journey with us'
                : 'Enter your details to access your account'}
            </p>

            <button
              onClick={handleToggle}
              className="self-start w-full h-13 px-12 py-3 border-2 border-white text-white rounded-full hover:bg-white/30 hover:text-black transition-all duration-300 font-semibold text-sm tracking-wider uppercase"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>

        {/* RIGHT FORM SECTION - Glassmorphic Dark */}
        <div className="w-full md:w-1/2 h-[300px] md:h-full bg-black/40 backdrop-blur-xl border-l border-white/10 overflow-hidden">

          <style>{`
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.25) transparent;
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.25);
      border-radius: 10px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  `}</style>
          {/*  SINGLE SCROLL CONTAINER */}
          <div className="h-full overflow-y-auto custom-scrollbar px-8 md:px-12 py-10 md:py-12">

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              {isLogin ? 'Sign in' : 'Create Account'}
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              {/* NAME */}
              {!isLogin && (
                <>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-white/90 mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      {...register("name", { required: "Name is required" })}
                      className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 rounded-full focus:outline-none transition-colors text-white placeholder-white/50 ${errors.name ? 'border-red-500' : 'border-white/30 focus:border-white/70'
                        }`}
                    />
                    {errors.name && (
                      <span className="text-red-400 text-xs mt-1">{errors.name.message}</span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-white/90 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: "Enter a valid phone number",
                        }
                      })}
                      className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 rounded-full focus:outline-none transition-colors text-white placeholder-white/50 ${errors.phone ? 'border-red-500' : 'border-white/30 focus:border-white/70'
                        }`}
                    />
                    {errors.phone && (
                      <span className="text-red-400 text-xs mt-1">{errors.phone.message}</span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-white/90 mb-2">Country</label>
                    <input
                      type="text"
                      placeholder="Enter your country"
                      {...register("country", { required: "Country is required" })}
                      className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 rounded-full focus:outline-none transition-colors text-white placeholder-white/50 ${errors.country ? 'border-red-500' : 'border-white/30 focus:border-white/70'
                        }`}
                    />
                    {errors.country && (
                      <span className="text-red-400 text-xs mt-1">{errors.country.message}</span>
                    )}
                  </div>

                  {/* DRAG AND DROP FILE UPLOAD */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-white/90 mb-2">Profile Picture</label>
                    <div
                      className={`relative border-2  border-dotted rounded-xl p-6 transition-all backdrop-blur-sm ${dragActive
                        ? 'border-blue-400 bg-blue-500/20'
                        : errors.avatar
                          ? 'border-red-400 bg-red-500/20'
                          : 'border-white/30 bg-white/5 hover:border-white/50'
                        }`}
                      onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        {...register("avatar", {
                          validate: {
                            fileType: (value) => {
                              if (!value || !value[0]) return "File is required";
                              const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
                              return allowedTypes.includes(value[0].type)
                                ? true
                                : "Only JPG, JPEG, or PNG files are allowed";
                            },
                            fileSize: (value) =>
                              value && value[0]?.size < 200 * 1024
                                ? true
                                : "Maximum file size is 200KB",
                          }
                        })}
                        onChange={onFileInputChange}
                        className="hidden"
                      />

                      <div className="text-center">
                        {selectedFile ? (
                          <div className="flex items-center justify-center gap-3">
                            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-left">
                              <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                              <p className="text-xs text-white/60">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <svg className="mx-auto h-12 w-12 text-white/50" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="mt-2 text-sm text-white/80">
                              <span className="font-semibold text-blue-400 cursor-pointer hover:text-blue-300" onClick={() => fileInputRef.current?.click()}>
                                Click to upload
                              </span> or drag and drop
                            </p>
                            <p className="text-xs text-white/50 mt-1">PNG, JPG, JPEG up to 200KB</p>
                          </>
                        )}
                      </div>

                      {selectedFile && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setValue('avatar', null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="absolute top-2 right-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    {errors.avatar && (
                      <span className="text-red-400 text-xs mt-1">{errors.avatar.message}</span>
                    )}
                  </div>
                </>
              )}

              {/* EMAIL */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-white/90 mb-2">Email</label>
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
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 rounded-full focus:outline-none transition-colors text-white placeholder-white/50 ${errors.email ? 'border-red-500' : 'border-white/30 focus:border-white/70'
                    }`}
                />
                {errors.email && (
                  <span className="text-red-400 text-xs mt-1">{errors.email.message}</span>
                )}
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-white/90 mb-2">Password</label>
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
                            "Password must contain 8+ characters, uppercase, lowercase, number & special character",
                        }
                      })
                    })}
                    className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 rounded-full focus:outline-none transition-colors pr-12 text-white placeholder-white/50 ${errors.password ? 'border-red-500' : 'border-white/30 focus:border-white/70'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-400 text-xs mt-1">{errors.password.message}</span>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              {!isLogin && (
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-white/90 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      {...register("confirm_password", {
                        required: "Confirm password is required",
                        validate: (value) =>
                          value === passwordValue || "Passwords do not match",
                      })}
                      className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 rounded-full focus:outline-none transition-colors pr-12 text-white placeholder-white/50 ${errors.confirm_password ? 'border-red-500' : 'border-white/30 focus:border-white/70'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <span className="text-red-400 text-xs mt-1">{errors.confirm_password.message}</span>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isUserAuthLoading}
                className={`w-full py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300 text-base mt-2 uppercase tracking-wider ${isUserAuthLoading
                  ? 'bg-white/20 cursor-not-allowed text-white/50 cursor-not-allowed'
                  : 'bg-transparent hover:bg-black text-white shadow-lg hover:shadow-xl backdrop-blur-sm cursor-pointer'
                  }`}
              >
                {isUserAuthLoading && (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                )}
                {isLogin ? "Sign In" : "Sign Up"}
              </button>
            </form>

            {isLogin && (
              <p className="text-sm mt-6 text-white/70 hover:text-white cursor-pointer transition-colors text-center">
                Forgot your password?
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;