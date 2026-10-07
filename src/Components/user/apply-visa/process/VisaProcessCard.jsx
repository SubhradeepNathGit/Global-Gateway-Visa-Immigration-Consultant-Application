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
            <div className="relative inline-block mb-4 flex-shrink-0">
                <div
                    className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] rounded-full overflow-hidden border-4 border-white bg-white relative z-10"
                    style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                >
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                {/* Step number badge */}
                <div
                    className="absolute bottom-2.5 right-2.5 w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full bg-[#dc2626] border-4 border-white flex items-center justify-center z-20"
                    style={{ boxShadow: '0 8px 20px rgba(220, 38, 38, 0.4)' }}
                >
                    <span className="text-lg sm:text-xl font-bold text-white leading-none">{id}</span>
                </div>
            </div>

            {/* Text card - Compact size */}
            <div className="bg-[#f1f5f9] rounded-xl px-4 py-3.5 sm:px-5 sm:py-4 w-full flex-1 flex flex-col justify-start transition-all duration-300 hover:bg-[#e2e8f0]">
                <h3 className="text-base sm:text-lg font-bold text-[#1e293b] mb-1.5 leading-snug">
                    {title}
                </h3>
                <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed">
                    {description}
                </p>
            </div>
        </motion.div>
    );
};

export default VisaProcessCard;