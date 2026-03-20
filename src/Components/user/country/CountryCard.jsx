import React from 'react'
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { useFullCountryDetails } from '../../../tanstack/query/getCountryDetails';
import { encodeBase64Url } from '../../../util/encodeDecode/base64';

const CountryCard = ({ countryId, countryName, countryDescription, countryData }) => {

    const { data, isLoading: isDetailsLoading } = useFullCountryDetails(countryId);
    
    // Prioritize data from props (pre-fetched in CountryList) to avoid redundant loading states
    const countryFlag = countryData?.country_details?.flag_url || data?.details?.flag_url || "/demo/demo-flag.png";
    const countryImage = countryData?.image_url || data?.details?.banner_url || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000";
    
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
    
    const isLoading = isDetailsLoading && !countryData?.country_details;

    return (
        <div className="w-full sm:w-1/2 lg:w-1/4 p-3 flex">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4 }}
                className="w-full relative group"
            >
                <div className="h-full bg-white rounded-[1.5rem] border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:border-[#FF5252]/20 hover:shadow-xl hover:shadow-gray-100">
                    {/* Country Image Header */}
                    <div className="relative h-44 overflow-hidden">
                        {isLoading ? (
                            <div className="animate-pulse bg-gray-100 w-full h-full"></div>
                        ) : (
                            <>
                                <img
                                    src={countryImage}
                                    alt={countryName}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                                
                                {/* Corner Flag Badge - Circular */}
                                <div className="absolute top-4 right-4 h-12 w-12 p-0.5 bg-white rounded-full shadow-lg border border-white/20 overflow-hidden">
                                    <img src={countryFlag} alt="flag" className="w-full h-full object-cover rounded-full" />
                                </div>

                                {/* Continent Tag */}
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-3 py-1 rounded-lg bg-black/30 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                                        {continents}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-grow flex flex-col">
                        <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#FF5252] transition-colors mb-2">
                            {countryName}
                        </h2>

                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 font-medium mb-6">
                            {countryDescription || "Explore pathways, career opportunities, and settlement options in this beautiful nation."}
                        </p>

                        <div className="mt-auto">
                            <Link
                                to={`/country/${encodeBase64Url(String(countryId))}`}
                                className="flex items-center justify-center w-full px-5 py-3 bg-gray-900 hover:bg-[#FF5252] text-white text-xs font-bold rounded-xl transition-all duration-300 active:scale-95"
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