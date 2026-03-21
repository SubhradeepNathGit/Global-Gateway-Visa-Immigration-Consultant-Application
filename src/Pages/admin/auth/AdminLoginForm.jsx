import React, { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../Redux/Slice/auth/authSlice';
import getSweetAlert from '../../../util/alert/sweetAlert';
import toastifyAlert from '../../../util/alert/toastify';
import { useNavigate } from 'react-router-dom';
import { updateLastSignInAt } from '../../../Redux/Slice/userSlice';

// Utility component for input fields
// Component removed as we are using synchronized manual inputs for full control over aesthetics

const AdminLoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const { isUserAuthLoading } = useSelector(state => state.auth);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        const auth_obj = {
            email: data.email,
            password: data.password,
            role: 'admin'
        };

        dispatch(loginUser(auth_obj)).unwrap()
            .then(res => {
                sessionStorage.setItem('admin_token', res.accessToken);
                dispatch(updateLastSignInAt({ id: res?.user?.id, user_type: 'admin' }))
                    .then(() => {
                        toastifyAlert.success('Admin Login Successful');
                        navigate('/admin/dashboard');
                    })
                    .catch(err => {
                        console.error('Error updating login time', err);
                        getSweetAlert('Oops...', 'Something went wrong during final verification!', 'error');
                    });
            })
            .catch(err => {
                getSweetAlert('Access Denied', err || 'Invalid admin credentials. Please try again.', 'error');
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
                    <video 
                        autoPlay loop muted playsInline
                        preload="auto"
                        poster="/admin1.png"
                        className="absolute top-0 left-0 w-full h-full object-cover"
                    >
                        <source src="/admin-signin.mp4" type="video/mp4" />
                    </video>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/75 via-black/50 to-transparent z-10" />

                    {/* Brand name — top left of left panel */}
                    <div className="absolute top-8 left-8 z-20 flex items-center gap-2">
                        <FlightTakeoffIcon className="text-white text-[30px]" />
                        <span className="text-white font-bold text-[22px] tracking-wide">Global Gateway</span>
                    </div>

                    {/* Left content — centered */}
                    <div className="relative z-10 h-full flex flex-col justify-center items-start px-8 md:px-16 py-12 md:py-0 text-left">
                        <div className="max-w-md">
                            <div className="flex flex-col mb-4">
                                <span className="text-white/40 text-sm md:text-lg font-medium tracking-widest uppercase">Global Gateway</span>
                                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight uppercase opacity-90">
                                    Administration
                                </h2>
                            </div>
                            <p className="text-white/30 text-base md:text-md mb-8 leading-relaxed">
                                Secure gateway for official platform management and oversight operations. High-level security protocols active.
                            </p>
                            
                            <div className="flex items-center gap-3 rounded-4xl">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white text-sm font-semibold">Endpoint Verification Active</p>
                                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Secure Session | AES-256 Encryption</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Notice — full-width bottom of video panel */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/40 backdrop-blur-xs p-6">
                        <p className="text-[10px] text-white/50 md:text-left text-center leading-relaxed">
                            <span className="text-[11px] font-bold text-white/80 uppercase block mb-1 md:inline-block md:mr-2 not-italic tracking-[0.1em]">Administrative Protocol</span>
                            Access to this portal is restricted to authorized personnel. Any unauthorized attempt to breach this system is monitored and will be logged for security audit.
                        </p>
                    </div>
                </div>

                {/* RIGHT FORM SECTION */}
                <div className="w-full md:w-1/2 bg-black/45 backdrop-blur-sm overflow-hidden flex flex-col justify-center">
                    <div className="w-full max-w-md mx-auto px-4 md:px-8 py-6">
                        
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 mt-8 md:mt-10 tracking-tight">System Admin Access</h2>
                        <p className="text-white/40 text-xs mb-8">Enter credentials to access system admin through secure gateway</p>

                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            
                            {/* EMAIL */}
                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-white/70 mb-1">Admin Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter your administrative email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-zA-Z.]{2,}$/,
                                            message: "Enter a valid email",
                                        }
                                    })}
                                    className={`w-full px-3 py-3.5 text-sm bg-white/10 backdrop-blur-sm border rounded-full focus:outline-none transition-colors text-white placeholder-white/40 ${errors.email ? 'border-red-500' : 'border-white/20 focus:border-white/60'}`}
                                />
                                {errors.email && <span className="text-red-400 text-xs mt-1">{errors.email.message}</span>}
                            </div>

                            {/* PASSWORD */}
                            <div className="flex flex-col">
                                <label className="text-xs font-medium text-white/70 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        {...register("password", { required: "Password is required" })}
                                        className={`w-full px-3 py-3.5 text-sm bg-white/10 backdrop-blur-sm border rounded-full focus:outline-none transition-colors pr-10 text-white placeholder-white/40 ${errors.password ? 'border-red-500' : 'border-white/20 focus:border-white/60'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                    </button>
                                </div>
                                {errors.password && <span className="text-red-400 text-xs mt-1">{errors.password.message}</span>}
                            </div>

                            <button
                                type="submit"
                                disabled={isUserAuthLoading}
                                className={`w-full py-3 mt-4 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 uppercase tracking-wider ${isUserAuthLoading
                                    ? 'bg-white/10 cursor-not-allowed text-white/40'
                                    : 'bg-transparent border border-white/30 hover:bg-black text-white hover:border-transparent'
                                }`}
                            >
                                {isUserAuthLoading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                                Sign In
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginForm;