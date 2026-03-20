import React from "react";
import { motion } from "framer-motion";

const CountryDescription = ({ image_url, name, continents, description, flag_url }) => {
    
    // Helper to extract clean strings from potential JSON arrays (e.g. "['Europe']")
    const getCleanContinent = (data) => {
        if (!data) return null;
        if (Array.isArray(data)) {
            const arr = data.map(item => String(item).replace(/[\[\]"]/g, ''));
            return arr.length > 0 ? arr[0] : null;
        }
        const cleaned = String(data).replace(/[\[\]"]/g, '').split(',')[0].trim();
        return cleaned || null;
    };

    const displayContinent = getCleanContinent(continents);

    return (
        <div className="relative group">
            {/* Home Page Theme Subtitle Style */}
            <div className="flex flex-col mb-4 lg:mb-6">
               
                <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold text-[#2c3e50] leading-tight flex flex-wrap items-baseline gap-2">
                    {name}
                    {displayContinent && (
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-medium text-gray-400">
                            , {displayContinent}
                        </span>
                    )}
                </h1>
            </div>

            <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] aspect-[19/9]">
                <img 
                    src={image_url || "/placeholder-country.jpg"} 
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                />
                
                {/* Brand Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Floating Flag Badge - Circular MUI style */}
                <motion.div 
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="absolute top-8 right-8 z-10"
                >
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-white p-1 shadow-2xl border-4 border-white/20 backdrop-blur-sm overflow-hidden flex items-center justify-center">
                        <img 
                            src={flag_url} 
                            alt={`${name} flag`}
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                </motion.div>

                {/* Hero Description Overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-8 sm:p-12 pb-10">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-white/60 uppercase tracking-[0.3em] mb-3">
                            / Country Details
                        </span>
                       
                            <p className="max-w-3xl text-white text-lg sm:text-[22px] font-medium leading-snug drop-shadow-lg opacity-100">
                                {description}
                            </p>
                        
                    </div>
                </div>
            </div>

            {/* User Interaction badges (matching home page feel) */}
            <div className="flex items-center gap-6 mt-8">
                <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                            <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                        </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-[#e53935] flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                        +2k
                    </div>
                </div>
                <p className="text-[13px] font-semibold text-gray-500">
                    <span className="text-[#e53935] font-black">2,400+</span> Travelers explored recently
                </p>
            </div>
        </div>
    );
};

export default CountryDescription;