import React from 'react';
import { motion } from 'framer-motion';

const VisaProcessCard = ({ id, title, description, image, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay, ease: 'easeOut' }}
            className="flex flex-col items-center text-center relative z-10 h-full w-full"
        >
            {/* Circle image with step badge */}
            <div className="relative inline-block mb-3.5 flex-shrink-0">
                <div
                    className="w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-white bg-white relative z-10 transition-transform duration-300 hover:scale-105"
                    style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }}
                >
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                {/* Step number badge */}
                <div
                    className="absolute bottom-1 right-1 w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-[#e53935] border-2 border-white flex items-center justify-center z-20 shadow-md"
                    style={{ boxShadow: '0 4px 12px rgba(229,57,53,0.35)' }}
                >
                    <span className="text-xs lg:text-sm font-bold text-white leading-none">{id}</span>
                </div>
            </div>

            {/* Text card - Equal size across all cards */}
            <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-5 w-full flex-1 flex flex-col justify-start min-h-[140px] transition-all duration-300 hover:bg-[#f1f5f9] hover:border-gray-200">
                <h3 className="text-base lg:text-lg font-bold text-[#2c3e50] mb-2 leading-snug">
                    {title}
                </h3>
                <p className="text-xs lg:text-sm text-[#6c757d] leading-relaxed">
                    {description}
                </p>
            </div>
        </motion.div>
    );
};

export default VisaProcessCard;