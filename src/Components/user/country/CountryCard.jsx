import React from 'react'
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { useFullCountryDetails } from '../../../tanstack/query/getCountryDetails';
import { encodeBase64Url } from '../../../util/encodeDecode/base64';

const CountryCard = ({ countryId, countryName, countryDescription }) => {

    const { data, isLoading } = useFullCountryDetails(countryId);
    const countryFlag = data?.details?.flag_url || "/demo/demo-flag.png";

    return (
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
                className="h-full">
                <motion.div
                    className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col text-center h-full"
                    whileHover={{
                        boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                    }}>
                    {/* Flag */}
                    <div className="flex justify-center mt-6 mb-4">
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-b-0 border-black"></div>
                        ) : (
                            <motion.img
                                src={countryFlag}
                                alt={`${countryName} flag`}
                                className="rounded-full border-1 border-black w-24 h-24 md:w-32 md:h-32 object-cover"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6, ease: "linear" }}
                            />
                        )}
                    </div>

                    {/* Name */}
                    <h2 className="text-xl font-bold text-gray-800 px-4">
                        {countryName}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-500 text-sm px-6 mt-2 mb-4 line-clamp-3">
                        {countryDescription?.length > 100
                            ? countryDescription.slice(0, 100) + "..."
                            : countryDescription || "No description available."}
                    </p>

                    {/* Button */}
                    <div className="mt-auto mb-6">
                        <Link
                            to={`/country/${encodeBase64Url(String(countryId))}`}
                            className="px-5 py-2 border-2 border-[#FF5252] text-[#FF5252] rounded-lg hover:bg-red-50 hover:border-red-500 hover:text-red-500 transition-all cursor:pointer"
                        >
                            View Details
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default CountryCard