import React from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const CountryCTA = ({ countryId, countryName, availableVisas, handleContinue }) => {
    
    const handleApplyVisa = () => {
        if (!availableVisas || availableVisas.length === 0) {
            toast.error(`No visa available for ${countryName || 'this country'} at this moment`, {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            return;
        }
        // Proceed with normal visa application logic if available
    };

    return (
        <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#2c3e50] leading-tight mb-8">
                Ready to Start Your Journey?
            </h2>

            <div className="flex flex-wrap justify-center gap-6">
                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApplyVisa}
                    className="px-8 py-4 bg-[#e53935] text-white rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-[#d32f2f] transition-all shadow-[0_8px_30px_rgba(229,57,53,0.3)]"
                >
                    Apply for Visa
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContinue}
                    className="px-8 py-4 bg-white text-[#2c3e50] border border-gray-100 rounded-xl font-bold text-sm tracking-widest uppercase hover:border-[#e53935] hover:text-[#e53935] transition-all shadow-sm"
                >
                    Explore Courses
                </motion.button>
            </div>
        </div>
    );
};

export default CountryCTA;