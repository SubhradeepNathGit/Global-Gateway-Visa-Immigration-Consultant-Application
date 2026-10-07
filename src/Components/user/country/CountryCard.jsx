import React, { useState, useCallback, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';
import { useFullCountryDetails } from '../../../tanstack/query/getCountryDetails';
import { encodeBase64Url } from '../../../util/encodeDecode/base64';

/* ─────────────────────────────────────────────────────────────────────────────
   Shimmer keyframe — injected once at module level so it works in production
   without any Tailwind dependency.
───────────────────────────────────────────────────────────────────────────── */
if (typeof document !== 'undefined' && !document.getElementById('cc-skeleton-style')) {
    const style = document.createElement('style');
    style.id = 'cc-skeleton-style';
    style.textContent = `
        @keyframes cc-shimmer {
            0%   { background-position: -800px 0; }
            100% { background-position:  800px 0; }
        }
        .cc-shimmer {
            background: linear-gradient(
                90deg,
                rgba(255,255,255,0.04) 25%,
                rgba(255,255,255,0.14) 50%,
                rgba(255,255,255,0.04) 75%
            );
            background-size: 800px 100%;
            animation: cc-shimmer 1.7s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
}

/* ─────────────────────────────────────────────────────────────────────────────
   Skeleton overlay — sits on top of the dark card bg, matches exact card shape
───────────────────────────────────────────────────────────────────────────── */
const CardSkeleton = () => (
    <div
        aria-hidden="true"
        style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            zIndex: 30,
            background: '#111827',   /* same as bg-gray-900 */
            overflow: 'hidden',
        }}
    >
        {/* Full-card shimmer sweep */}
        <div
            className="cc-shimmer"
            style={{ position: 'absolute', inset: 0 }}
        />

        {/* Top bar: continent pill + flag circle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', position: 'relative', zIndex: 1 }}>
            <div
                style={{
                    height: 22,
                    width: 78,
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(4px)',
                }}
            />
            <div
                style={{
                    height: 56,
                    width: 56,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.12)',
                }}
            />
        </div>

        {/* Bottom text + button area */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 16px', zIndex: 1 }}>
            {/* Country name bar */}
            <div style={{ height: 26, width: '55%', borderRadius: 6, background: 'rgba(255,255,255,0.14)', marginBottom: 10 }} />
            {/* Tagline bars */}
            <div style={{ height: 13, width: '80%', borderRadius: 4, background: 'rgba(255,255,255,0.09)', marginBottom: 5 }} />
            <div style={{ height: 13, width: '55%', borderRadius: 4, background: 'rgba(255,255,255,0.07)', marginBottom: 18 }} />
            {/* Button placeholder */}
            <div style={{ height: 44, width: '100%', borderRadius: 8, background: 'rgba(255,255,255,0.10)' }} />
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   CountryCard
───────────────────────────────────────────────────────────────────────────── */
const CountryCard = ({ countryId, countryName, countryDescription, countryData }) => {
    // Only fetch details if not already provided in countryData to prevent redundant network requests
    const hasSufficientData = Boolean(
        countryData?.country_details?.flag_url && (countryData?.image_url || countryData?.country_details?.banner_url)
    );
    const { data } = useFullCountryDetails(hasSufficientData ? null : countryId);

    // Prioritize pre-fetched data for instant rendering
    const countryFlag  = countryData?.country_details?.flag_url  || data?.details?.flag_url  || "/demo/demo-flag.png";
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

    const tagline     = countryDescription || "Discover opportunities & begin your journey";
    const countryLink = `/country/${encodeBase64Url(String(countryId))}`;

    /* ── Per-card image load state ─────────────────────────────────────────
       Root-cause fix for jitter:

       Problem 1 — Cache hit race:
         When an image is already in the browser cache, the browser fires
         onLoad *synchronously* while React is still committing the DOM.
         This causes: render(skeleton=true) → immediate re-render(skeleton=false)
         = 1-frame flash/jitter on every revisit.
         Fix: useLayoutEffect checks img.complete BEFORE the first paint.
         If images are cached, imagesReady becomes true with zero flicker.

       Problem 2 — Double opacity animation:
         The skeleton fade-out (0→0 opacity) overlapped with the image
         fade-in (0→1 opacity), creating a stutter during the overlap.
         Fix: images are always opacity:1. The solid skeleton COVERS them.
         Only the skeleton animates. Zero overlap, zero stutter.
    ─────────────────────────────────────────────────────────────────────── */
    const bannerRef = useRef(null);
    const flagRef   = useRef(null);

    const [bannerLoaded, setBannerLoaded] = useState(false);
    const [flagLoaded,   setFlagLoaded]   = useState(false);

    // Check cached images before the browser paints (useLayoutEffect = synchronous)
    useLayoutEffect(() => {
        if (bannerRef.current?.complete) setBannerLoaded(true);
        if (flagRef.current?.complete)   setFlagLoaded(true);
    }, []);

    const onBannerLoad  = useCallback(() => setBannerLoaded(true), []);
    const onFlagLoad    = useCallback(() => setFlagLoaded(true),   []);
    // On error: still reveal the card — fallback bg-gray-900 is already visible
    const onBannerError = useCallback(() => setBannerLoaded(true), []);
    const onFlagError   = useCallback(() => setFlagLoaded(true),   []);

    const imagesReady = bannerLoaded && flagLoaded;

    return (
        <div className="w-full sm:w-1/2 lg:w-1/3 p-3 sm:p-3.5 flex">
            <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="w-full relative group cursor-pointer"
            >
                {/* ═══ CARD CONTAINER ═══ */}
                <div className="country-card relative h-[360px] sm:h-[400px] w-full rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-gray-900">

                    {/* ── Skeleton: visible until both images are ready ── */}
                    <AnimatePresence>
                        {!imagesReady && (
                            <motion.div
                                key="card-skeleton"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                style={{ position: 'absolute', inset: 0, zIndex: 30 }}
                            >
                                <CardSkeleton />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Background image ── */}
                    <div className="absolute inset-0 overflow-hidden bg-gray-900">
                        <img
                            ref={bannerRef}
                            src={countryImage}
                            alt={countryName}
                            loading="eager"
                            fetchpriority="high"
                            decoding="async"
                            onLoad={onBannerLoad}
                            onError={onBannerError}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                /* NO opacity animation — skeleton covers the image.
                                   Removing it eliminates the double-animation stutter. */
                                transition: 'transform 0.7s ease-out',
                            }}
                            className="group-hover:scale-105"
                        />

                        {/* Bottom gradient */}
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
                                ref={flagRef}
                                src={countryFlag}
                                alt="flag"
                                loading="eager"
                                fetchpriority="high"
                                decoding="async"
                                onLoad={onFlagLoad}
                                onError={onFlagError}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                    /* NO opacity animation — skeleton covers the flag too */
                                }}
                            />
                        </div>
                    </div>

                    {/* ── WHITE EMBOSSED TEXT ── */}
                    <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 sm:p-6 pb-[74px] sm:pb-[78px] pointer-events-none">
                        <div className="relative z-10 transition-all duration-300 ease-out opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0">
                            {/* Country Name */}
                            <h2
                                className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-1.5"
                                style={{
                                    fontFamily: "'Outfit', sans-serif",
                                    textShadow: '0 2px 4px rgba(0,0,0,0.95), 0 4px 12px rgba(0,0,0,0.8), 0 1px 2px #000'
                                }}
                            >
                                {countryName}
                            </h2>

                            {/* Tagline */}
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

                    {/* ── CTA Button ── */}
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

                    {/* Full-card clickable area */}
                    <Link
                        to={countryLink}
                        aria-label={`View ${countryName}`}
                        className="absolute inset-0 z-10"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default CountryCard;