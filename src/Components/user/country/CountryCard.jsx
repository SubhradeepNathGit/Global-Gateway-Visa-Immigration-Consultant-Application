import React, { useState, useCallback, useRef, useLayoutEffect } from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { encodeBase64Url } from '../../../util/encodeDecode/base64';

/* ─────────────────────────────────────────────────────────────────────────────
   Inject styles — ID versioned so hot-reload always picks up latest rules.
   All animation classes are defined here; no Tailwind dependency.
───────────────────────────────────────────────────────────────────────────── */
(() => {
    const ID = 'cc-style-v4';
    const existing = document.getElementById(ID);
    if (existing) existing.remove(); // always replace on module re-eval
    if (typeof document === 'undefined') return;
    const s = document.createElement('style');
    s.id = ID;
    s.textContent = `
        @keyframes cc-wave {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
        }
        @keyframes cc-fadeout {
            from { opacity: 1; }
            to   { opacity: 0; pointer-events: none; }
        }
        .cc-skeleton-exit {
            animation: cc-fadeout 0.28s ease-out forwards;
            pointer-events: none !important;
        }
        .cc-img-reveal  { opacity: 0; will-change: opacity; }
        .cc-img-visible { opacity: 1 !important; transition: opacity 0.35s ease-out; }
    `;
    document.head.appendChild(s);
})();


/* ─────────────────────────────────────────────────────────────────────────────
   CardSkeleton — white liquid-morphic shimmer, 100% inline styles
   No CSS class used for background/color → cached old styles can't interfere
───────────────────────────────────────────────────────────────────────────── */
const CardSkeleton = ({ exiting }) => {
    // Bar helper
    const Bar = ({ w, h, r = 6, mb = 0 }) => (
        <div style={{
            height: h,
            width: w,
            borderRadius: r,
            marginBottom: mb,
            background: 'linear-gradient(135deg, #e8ecf0 0%, #f1f4f7 50%, #e8ecf0 100%)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* inner wave on each bar */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.75) 50%, transparent 100%)',
                animation: 'cc-wave 1.6s ease-in-out infinite',
            }} />
        </div>
    );

    return (
        <div
            aria-hidden="true"
            className={exiting ? 'cc-skeleton-exit' : ''}
            style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                zIndex: 30,
                overflow: 'hidden',
                pointerEvents: exiting ? 'none' : 'auto',
                /* White liquid-morphic base — layered radial glows */
                background: `
                    radial-gradient(ellipse at 20% 20%, rgba(226,232,240,0.9) 0%, transparent 60%),
                    radial-gradient(ellipse at 80% 80%, rgba(203,213,225,0.7) 0%, transparent 55%),
                    linear-gradient(160deg, #f8fafc 0%, #f1f5f9 40%, #e2e8f0 100%)
                `,
            }}
        >
            {/* Full-card flowing shimmer wave */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.85) 50%, transparent 70%)',
                animation: 'cc-wave 1.8s ease-in-out infinite',
                zIndex: 1,
            }} />

            {/* Top bar — continent pill + flag circle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', position: 'relative', zIndex: 2 }}>
                {/* Continent pill */}
                <div style={{
                    height: 24, width: 82, borderRadius: 999,
                    background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.8)',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)', animation: 'cc-wave 1.6s ease-in-out infinite 0.1s' }} />
                </div>
                {/* Flag circle */}
                <div style={{
                    height: 56, width: 56, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.9), 0 2px 8px rgba(148,163,184,0.3)',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)', animation: 'cc-wave 1.6s ease-in-out infinite 0.2s' }} />
                </div>
            </div>

            {/* Bottom placeholder area */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 16px 14px', zIndex: 2 }}>
                <Bar w="52%" h={22} r={6}  mb={10} />
                <Bar w="78%" h={12} r={4}  mb={6}  />
                <Bar w="55%" h={12} r={4}  mb={16} />
                {/* Button bar with glassy inset */}
                <div style={{
                    height: 46, width: '100%', borderRadius: 10,
                    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                    boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.9), inset 0 -1px 2px rgba(148,163,184,0.2)',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)', animation: 'cc-wave 1.6s ease-in-out infinite 0.3s' }} />
                </div>
            </div>
        </div>
    );
};


/* ─────────────────────────────────────────────────────────────────────────────
   CountryCard — zero-jitter image loading
   ─ No AnimatePresence (caused exit-opacity conflict with image reveal opacity)
   ─ Skeleton fades out via pure CSS class swap — no React re-render during anim
   ─ Images use cc-img-reveal / cc-img-visible CSS classes (no inline opacity state)
   ─ useLayoutEffect checks .complete && .naturalWidth > 0 before first paint
   ─ skeletonMounted unmounts the DOM node 280ms after images are ready
───────────────────────────────────────────────────────────────────────────── */
const CountryCard = ({ countryId, countryName, countryDescription, countryData }) => {
    /* All data is pre-fetched by CountryList via Redux — no per-card API call */
    const countryFlag  = countryData?.country_details?.flag_url  || "/demo/demo-flag.png";
    const countryImage = countryData?.image_url || countryData?.country_details?.banner_url
                         || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000";

    const continentsData = countryData?.country_details?.continents;
    const continents = (() => {
        if (!continentsData) return "Global";
        if (Array.isArray(continentsData)) return continentsData[0];
        if (typeof continentsData === 'string' && continentsData.startsWith('[')) {
            try {
                const parsed = JSON.parse(continentsData);
                return Array.isArray(parsed) ? parsed[0] : parsed;
            } catch (e) {
                return continentsData.replace(/[\[\]" ]/g, '');
            }
        }
        return continentsData;
    })();

    const tagline     = countryDescription || "Discover opportunities & begin your journey";
    const countryLink = `/country/${encodeBase64Url(String(countryId))}`;

    /* ── Image load tracking ───────────────────────────────────────────────
       useLayoutEffect (synchronous, before paint):
         Checks .complete && .naturalWidth > 0 — handles cached images.
         If both cached: set imagesReady immediately, skip skeleton entirely.

       Once both images fire onLoad:
         → skeleton class flips to cc-skeleton-exit (CSS 280ms fade-out)
         → 280ms later: skeletonMounted = false removes skeleton from DOM
         → images flip from cc-img-reveal to cc-img-visible (CSS opacity 0→1)

       Net result: zero React-level animation conflict.
    ─────────────────────────────────────────────────────────────────────── */
    const bannerRef = useRef(null);
    const flagRef   = useRef(null);

    const [bannerLoaded, setBannerLoaded] = useState(false);
    const [flagLoaded,   setFlagLoaded]   = useState(false);
    const [skeletonMounted, setSkeletonMounted] = useState(true);

    useLayoutEffect(() => {
        const bannerDone = bannerRef.current?.complete && (bannerRef.current?.naturalWidth ?? 0) > 0;
        const flagDone   = flagRef.current?.complete   && (flagRef.current?.naturalWidth   ?? 1) > 0;
        if (bannerDone) setBannerLoaded(true);
        if (flagDone)   setFlagLoaded(true);
        // Both cached — skip skeleton entirely (no CSS transition needed)
        if (bannerDone && flagDone) setSkeletonMounted(false);
    }, []);

    const onBannerLoad  = useCallback(() => setBannerLoaded(true), []);
    const onFlagLoad    = useCallback(() => setFlagLoaded(true),   []);
    const onBannerError = useCallback(() => setBannerLoaded(true), []);
    const onFlagError   = useCallback(() => setFlagLoaded(true),   []);

    const imagesReady = bannerLoaded && flagLoaded;

    /* Once images are ready, unmount skeleton after its CSS fade-out (280ms) */
    useLayoutEffect(() => {
        if (!imagesReady || !skeletonMounted) return;
        const t = setTimeout(() => setSkeletonMounted(false), 290);
        return () => clearTimeout(t);
    }, [imagesReady]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="w-full sm:w-1/2 lg:w-1/3 p-3 sm:p-3.5 flex">
            <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="w-full relative group cursor-pointer"
            >
                {/* ═══ CARD CONTAINER ═══ */}
                <div className="country-card relative h-[360px] sm:h-[400px] w-full rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white">

                    {/* ── Skeleton: CSS fade-out, then unmount — no React animation conflict ── */}
                    {skeletonMounted && <CardSkeleton exiting={imagesReady} />}

                    {/* ── Background image: opacity controlled purely by CSS class swap ── */}
                    <div className="absolute inset-0 overflow-hidden bg-gray-900">
                        <img
                            ref={bannerRef}
                            src={countryImage}
                            alt={countryName}
                            loading="eager"
                            fetchpriority="high"
                            decoding="sync"
                            onLoad={onBannerLoad}
                            onError={onBannerError}
                            className={`group-hover:scale-105 ${imagesReady ? 'cc-img-visible' : 'cc-img-reveal'}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'opacity 0.3s ease-out, transform 0.7s ease-out',
                                willChange: 'opacity, transform',
                            }}
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
                                decoding="sync"
                                onLoad={onFlagLoad}
                                onError={onFlagError}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                }}
                            />
                        </div>
                    </div>

                    {/* ── Country Name + Tagline: only shown after images are ready ─────────
                         Key insight: the inner div has opacity-0 + group-hover:opacity-100.
                         If the skeleton (zIndex 30) is still mounted, these are hidden anyway.
                         But if we LEFT this layer at opacity-0 while the skeleton's EXIT
                         animation runs, Tailwind's opacity-0 would conflict with the skeleton's
                         own opacity fade — producing a stutter.
                         Solution: gate the entire text layer on !skeletonMounted so it only
                         mounts AFTER the skeleton DOM node is removed. No conflict possible.
                    ── */}
                    {!skeletonMounted && (
                        <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 sm:p-6 pb-[74px] sm:pb-[78px] pointer-events-none">
                            <div className="relative z-10 transition-all duration-300 ease-out opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0">
                                <h2
                                    className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-1.5"
                                    style={{
                                        fontFamily: "'Outfit', sans-serif",
                                        textShadow: '0 2px 4px rgba(0,0,0,0.95), 0 4px 12px rgba(0,0,0,0.8), 0 1px 2px #000'
                                    }}
                                >
                                    {countryName}
                                </h2>
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
                    )}

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