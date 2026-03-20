import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import supabase from '../../../util/Supabase/supabase';
import getSweetAlert from '../../../util/alert/sweetAlert';
import hotToast from '../../../util/alert/hot-toast';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });

      if (error) {
        throw error;
      }

      setIsSuccess(true);
      hotToast('Password reset successfully', 'success');
      
      // Clear the recovery session so they land on login correctly
      await supabase.auth.signOut();
      
      setTimeout(() => {
        navigate('/authentication');
      }, 3000);
    } catch (err) {
      console.error('Reset password error:', err);
      getSweetAlert('Oops...', err.message || 'Failed to reset password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center px-4 py-8"
      style={{ backgroundImage: 'url(/Slider1.jpg)' }}
    >
      <div className="w-full max-w-[500px] bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden p-8 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
              <Lock className="text-white w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-white">New Password</h2>
            <p className="text-white/60 mt-2">Please enter your new password below.</p>
          </div>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircle className="text-green-400 w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white">Password Updated!</h3>
              <p className="text-white/60 mt-2">Redirecting you to login...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-white/90 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                        message: "Password must contain 8+ characters, uppercase, lowercase, number & special character"
                      }
                    })}
                    className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 rounded-full focus:outline-none transition-colors pr-12 text-white placeholder-white/50 ${errors.password ? 'border-red-500' : 'border-white/30 focus:border-white/70'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <span className="text-red-400 text-xs mt-1">{errors.password.message}</span>}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-white/90 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    {...register("confirm_password", {
                      required: "Please confirm your password",
                      validate: (value) => value === passwordValue || "Passwords do not match",
                    })}
                    className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 rounded-full focus:outline-none transition-colors pr-12 text-white placeholder-white/50 ${errors.confirm_password ? 'border-red-500' : 'border-white/30 focus:border-white/70'}`}
                  />
                </div>
                {errors.confirm_password && <span className="text-red-400 text-xs mt-1">{errors.confirm_password.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 bg-white text-black hover:bg-white/90 transition-all duration-300 text-base shadow-lg uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                Reset Password
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/authentication')}
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Back to Login
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
