import React from 'react';
import { motion } from 'framer-motion';

const SuccessHeader = ({ paymentDetails, type }) => {
    return (
        <div className="relative bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-700 px-6 md:px-12 py-12 md:py-16 lg:py-20 text-center shadow-lg print:p-8 print:py-12 print:bg-none print:shadow-none print:border-b-4 print:border-cyan-500">
            <div className="relative max-w-4xl mx-auto">
                {/* Real Google Pay / PhonePe Animated Checkmark */}
                <div className="inline-flex mb-6 print:hidden">
                    <div className="relative flex items-center justify-center">
                        {/* Smooth One-Time Expanding Ripple Ring */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0.8 }}
                            animate={{ scale: 1.4, opacity: 0 }}
                            transition={{ duration: 0.85, ease: "easeOut", delay: 0.15 }}
                            className="absolute inset-0 rounded-full bg-emerald-300/40 pointer-events-none"
                        />

                        {/* Solid Success Disc */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 280, damping: 20 }}
                            className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-950/25 border-2 border-white/20"
                        >
                            {/* Animated SVG Tick Path */}
                            <svg className="w-13 h-13 md:w-16 md:h-16" viewBox="0 0 52 52">
                                <motion.path
                                    d="M14 27 L22 35 L38 17"
                                    fill="none"
                                    stroke="#ffffff"
                                    strokeWidth="4.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.45, ease: "easeOut", delay: 0.22 }}
                                />
                            </svg>
                        </motion.div>
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white print:text-gray-900 mb-3 md:mb-4 font-['Outfit']">
                    Transaction Successful!
                </h1>
                <p className="text-base mb-4 md:text-lg lg:text-xl text-white/95 print:text-gray-600 max-w-2xl mx-auto font-normal">
                    {type === 'visa' 
                        ? 'Your visa application has been successfully submitted and processed' 
                        : 'You have successfully purchased your selected course'}
                </p>

                {/* Clean Transaction ID without boxed card */}
                <p className="mt-3 text-xs md:text-sm tracking-wider uppercase font-medium text-white/80 print:text-gray-600">
                    Transaction ID:{' '}
                    <span className="font-mono font-bold text-white print:text-gray-900 tracking-wider text-sm md:text-base ml-1.5 select-all">
                        {paymentDetails?.transaction_id}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default SuccessHeader;