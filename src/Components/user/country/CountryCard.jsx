import React from 'react'
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { useFullCountryDetails } from '../../../tanstack/query/getCountryDetails';
import { encodeBase64Url } from '../../../util/encodeDecode/base64';

const CountryCard = ({ countryId, countryName, countryDescription, countryData }) => {
    // Only fetch details if not already provided in countryData to prevent redundant network requests
    const hasSufficientData = Boolean(
        countryData?.country_details?.flag_url && (countryData?.image_url || countryData?.country_details?.banner_url)
    );
    const { data } = useFullCountryDetails(hasSufficientData ? null : countryId);

    // Prioritize pre-fetched data for instant rendering
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

    const tagline = countryDescription || "Discover opportunities & begin your journey";
    const countryLink = `/country/${encodeBase64Url(String(countryId))}`;

    return (
        <div className="w-full sm:w-1/2 lg:w-1/3 p-3 sm:p-3.5 flex">
            <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="w-full relative group cursor-pointer"
            >
                {/* ═══ CARD CONTAINER: Height (320px-350px), crisp rounded-xl ═══ */}
                <div className="country-card relative h-[320px] sm:h-[350px] w-full rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-gray-900">
                    
                    {/* ═══ BACKGROUND IMAGE: Instant solid render (NO pulsing, NO heartbeat animation) ═══ */}
                    <div className="absolute inset-0 overflow-hidden bg-gray-900">
                        <img
                            src={countryImage}
                            alt={countryName}
                            loading="eager"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />

                        {/* Soft subtle bottom gradient specifically to make white embossed text pop */}
                        <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-black/75 via-black/35 to-transparent pointer-events-none" />
                    </div>

                    {/* ── Top Bar: Continent Tag + Circular Flag Badge ── */}
                    <div className="relative z-20 flex items-center justify-between p-4 pointer-events-none">
                        {/* Continent Tag */}
                        <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-[0.14em] border border-white/20 shadow-sm">
                            {continents}
                        </span>

                        {/* Circular Flag Badge */}
                        <div className="h-14 w-14 p-[3px] bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-white/60 overflow-hidden transition-transform duration-300 group-hover:scale-110">
                            <img
                                src={countryFlag}
                                alt="flag"
                                loading="eager"
                                decoding="async"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                    </div>

                    {/* ═══ WHITE EMBOSSED TEXT: High readability over any landscape/city image ═══ */}
                    <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 sm:p-6 pb-[74px] sm:pb-[78px] pointer-events-none">
                        <div className="relative z-10 transition-all duration-300 ease-out opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0">
                            {/* Embossed Country Name */}
                            <h2
                                className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-1.5"
                                style={{
                                    fontFamily: "'Outfit', sans-serif",
                                    textShadow: '0 2px 4px rgba(0,0,0,0.95), 0 4px 12px rgba(0,0,0,0.8), 0 1px 2px #000'
                                }}
                            >
                                {countryName}
                            </h2>

                            {/* Embossed Tagline */}
                            <p
                                className="text-white/95 text-xs sm:text-sm font-semibold leading-relaxed line-clamp-2"
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    textShadow: '0 1px 3px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.85), 0 1px 1px #000'
                                }}
                            >
                                {tagline}
                            </p>
                        </div>
                    </div>

                    {/* ═══ TRANSPARENT SQUARE-ISH BUTTON (White embossed text + glass finish) ═══ */}
                    <div className="absolute bottom-3.5 sm:bottom-4 left-3.5 sm:left-4 right-3.5 sm:right-4 z-20">
                        <Link
                            to={countryLink}
                            className="w-full py-2.5 sm:py-3 px-4 rounded-lg
                                       bg-white/20 hover:bg-white/35 active:scale-[0.98]
                                       backdrop-blur-md border border-white/50 hover:border-white/80
                                       shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)]
                                       flex items-center justify-center gap-2
                                       text-white font-bold text-xs sm:text-sm tracking-wide
                                       transition-all duration-300 group/btn"
                            style={{
                                fontFamily: "'Outfit', sans-serif",
                                textShadow: '0 1px 3px rgba(0,0,0,0.9)'
                            }}
                        >
                            <span>Visit {countryName}</span>
                            <svg
                                className="w-4 h-4 text-white group-hover/btn:translate-x-1.5 transition-all duration-300"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </div>

                    {/* Full-card clickable area to navigate */}
                    <Link
                        to={countryLink}
                        aria-label={`View ${countryName}`}
                        className="absolute inset-0 z-10"
                    />
                </div>
            </motion.div>
        </div>
    )
}

export default CountryCard