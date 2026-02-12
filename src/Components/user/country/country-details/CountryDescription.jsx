import React from 'react'
import { motion } from "framer-motion";
import { DollarSign } from 'lucide-react';

const CountryDescription = ({ image_url, name, description, flag_url }) => {

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 lg:mb-24">

            {/* Left: Image */}
            <motion.div variants={itemVariants}>
                <div className="relative rounded-lg overflow-hidden shadow-2xl group">
                    <img
                        src={image_url}
                        alt={name}
                        className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-0.5 bg-red-500"></div>
                            <span className="text-white/90 text-xs font-semibold tracking-widest uppercase">Destination</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">{name}</h2>
                    </div>
                </div>
            </motion.div>

            {/* Right: Description */}
            <motion.div
                variants={itemVariants}
                className="relative flex flex-col justify-center"
            >

                {/* Flag at top-right */}
                <img
                    src={flag_url}
                    alt={`${name} flag`}
                    className="hidden md:block absolute top-10 right-10 transform translate-y-[-50%] translate-x-[30%]
                    rounded-full border-4 border-white shadow-lg
                    w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 object-cover" />

                <div className="flex items-center gap-3 mb-6 mt-10">
                    <div className="w-1 h-12 bg-red-500 rounded-full"></div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 tracking-tight">
                        {name}
                    </h1>
                </div>

                <div className="border-l-2 border-gray-200 pl-6">
                    <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-widest">
                        Overview
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base lg:text-lg font-light">
                        {description}
                    </p>
                </div>
            </motion.div>

        </div>
    )
}

export default CountryDescription