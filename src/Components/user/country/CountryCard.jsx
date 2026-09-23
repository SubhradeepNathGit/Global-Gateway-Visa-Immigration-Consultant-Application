import React, { useState } from 'react'
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { useFullCountryDetails } from '../../../tanstack/query/getCountryDetails';
import { encodeBase64Url } from '../../../util/encodeDecode/base64';

const CountryCard = ({ countryId, countryName, countryDescription, countryData }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [flagLoaded, setFlagLoaded] = useState(false);

    // Only fetch details if not already provided in countryData to prevent 24 redundant network requests on 1st load
    const hasSufficientData = Boolean(
        countryData?.country_details?.flag_url && (countryData?.image_url || countryData?.country_details?.banner_url)
    );
    const { data } = useFullCountryDetails(hasSufficientData ? null : countryId);

    // Prioritize data from props (pre-fetched in CountryList) for instant rendering
    const countryFlag = countryData?.country_details?.flag_url || data?.details?.flag_url || "/demo/demo-flag.png";
    const countryImage = countryData?.image_url || countryData?.country_details?.banner_url || data?.details?.banner_url || data?.image_url || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000";

    const continentsData = countryData?.country_details?.continents || data?.details?.continents;
    const continents = (() => {
        if (!continentsData) return "Global";
        if (Array.isArray(continentsData)) return continentsData[0];
        if (typeof continentsData === 'string' && continentsData.startsWith('[')) {
            try {
                const parsed = JSON.parse(continentsData);
                return Array.isArray(parsed) ? parsed[0] : parsed;
            } catch (e) {
                return continentsData.replace(/[\[\]\" ]/g, ''); 
            }
        }
        return continentsData;
    })();

    return (
        <div className="w-full sm:w-1/2 lg:w-1/4 p-3 flex">
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-full relative group"
            >
                <div className="h-full bg-white rounded-[1.4rem] border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:border-[#FF5252]/25 hover:shadow-xl hover:shadow-gray-200/60">
                    {/* Country Image Header - Taller & Cinematic */}
                    <div className="relative h-52 overflow-hidden bg-gray-100">
                        {/* Shimmer placeholder while image loads */}
                        <div
                            className={`absolute inset-0 bg-gray-200 animate-pulse transition-opacity duration-500 ${
                                imageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
                            }`}
                        />

                        <img
                            src={countryImage}
                            alt={countryName}
                            loading="eager"
                            decoding="async"
                            onLoad={() => setImageLoaded(true)}
                            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-102'
                            }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-gray-900/15 to-transparent pointer-events-none" />

                        {/* Corner Flag Badge - Circular & Sleek */}
                        <div className="absolute top-3.5 right-3.5 h-10 w-10 p-0.5 bg-white/95 backdrop-blur-sm rounded-full shadow-md border border-white/50 overflow-hidden z-10 transition-transform duration-300 group-hover:scale-105">
                            <img
                                src={countryFlag}
                                alt="flag"
                                loading="eager"
                                decoding="async"
                                onLoad={() => setFlagLoaded(true)}
                                className={`w-full h-full object-cover rounded-full transition-opacity duration-300 ${
                                    flagLoaded ? 'opacity-100' : 'opacity-80'
                                }`}
                            />
                        </div>

                        {/* Continent Tag */}
                        <div className="absolute bottom-3 left-3 z-10">
                            <span className="px-2.5 py-1 rounded-lg bg-black/45 backdrop-blur-md text-[9.5px] font-bold text-white uppercase tracking-wider border border-white/15">
                                {continents}
                            </span>
                        </div>
                    </div>

                    {/* Content - Compact & Refined */}
                    <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                            <h2 className="text-[17px] font-bold text-gray-900 group-hover:text-[#FF5252] transition-colors leading-tight mb-1 truncate" title={countryName}>
                                {countryName}
                            </h2>

                            <p className="text-gray-500 text-[11.5px] leading-relaxed line-clamp-2 font-medium mb-3.5">
                                {countryDescription || "Explore pathways, career opportunities, and settlement options in this beautiful nation."}
                            </p>
                        </div>

                        <div>
                            <Link
                                to={`/country/${encodeBase64Url(String(countryId))}`}
                                className="flex items-center justify-center w-full py-2.5 px-4 bg-black/80 hover:bg-[#FF5252] text-white text-xs font-bold rounded-xl transition-all duration-300 active:scale-95 shadow-sm group-hover:shadow-md"
                            >
                                Visit Now
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default CountryCard