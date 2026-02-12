import React from 'react'
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../Redux/Slice/auth/authSlice';
import getSweetAlert from '../../../util/alert/sweetAlert';
import { getAllAdmins } from '../../../Redux/Slice/adminSlice';

const AddAdmin = ({ setShowSuccess, setSuccessMessage, setShowAddModal }) => {
    const dispatch = useDispatch(),
        { isUserAuthLoading, userAuthData, userAuthError } = useSelector(state => state.auth);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const handleAddAdmin = (data) => {
        // console.log("FORM SUBMITTED:", data);

        const auth_obj = {
            name: data.name,
            phone: data.phone,
            email: data.email,
            avatar: null,
            password: data.password,
            is_verified: "pending",
            is_blocked: false,
            role: "admin",
        }

        dispatch(registerUser(auth_obj))
            .then(res => {
                console.log('Response for register', res);

                if (res.meta.requestStatus === "fulfilled") {
                    // hotToast('Admin registered successfully. Please verify the email', "success");
                    reset();
                    setShowAddModal(false);
                    setShowSuccess(true);
                    setSuccessMessage('Admin registered successfully. Please verify the email');
                    dispatch(getAllAdmins());
                }
                else {
                    getSweetAlert('Oops...', res.payload, 'info');
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    };

    const onSubmit = handleSubmit(handleAddAdmin);

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => {
                setShowAddModal(false);
                reset();
            }}
        >
            <div
                className="bg-slate-800 rounded-xl border border-slate-700 shadow-2xl max-w-md w-full p-6 space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Add New Admin</h3>
                        <p className="text-sm text-slate-400 mt-1">Grant a new admin access</p>
                    </div>
                    <button
                        onClick={() => {
                            setShowAddModal(false);
                            reset();
                        }}
                        className="p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                            Admin Name
                        </label>
                        <input id="name" type="text"
                            {...register("name", {
                                required: "Name is required",
                                minLength: {
                                    value: 2,
                                    message: "Name must be at least 2 characters"
                                }
                            })}
                            placeholder="John Doe"
                            className="w-full px-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                            Email
                        </label>
                        <input id="email" type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-zA-Z.]{2,}$/,
                                    message: "Invalid email address"
                                }
                            })}
                            placeholder="admin@example.com"
                            className="w-full px-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                            Phone Number
                        </label>
                        <input id="phone" type="tel"
                            {...register("phone", {
                                required: "Phone number is required",
                                pattern: {
                                    value: /^[6-9]\d{9}$/,
                                    message: "Invalid phone number"
                                },
                                minLength: {
                                    value: 10,
                                    message: "Phone number must be at least 10 digits"
                                }
                            })}
                            placeholder="+91-9876543210"
                            className="w-full px-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        />
                        {errors.phone && (
                            <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                            Password
                        </label>
                        <input id="password" type="password"
                            {...register("password", {
                                required: "password is required",
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                                    message: "Password must contain 8+ characters, uppercase, lowercase, number & special character",
                                }
                            })}
                            placeholder='Admin12@GG'
                            className="w-full px-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button"
                            onClick={() => {
                                setShowAddModal(false);
                                reset();
                            }}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 text-white text-sm transition-all font-medium">
                            Cancel
                        </button>
                        <button type="button" onClick={onSubmit}
                            className={`flex-1 px-4 py-2.5 rounded-lg hover:bg-blue-700 ${isUserAuthLoading ? 'bg-blue-600' : 'bg-blue-700'} text-white text-sm transition-all font-medium cursor-pointer`}
                        >
                            <span className='flex items-center justify-center'>
                                {isUserAuthLoading && (
                                    <div className="w-4 h-4 border-1 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                )}
                                Add Admin
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddAdmin