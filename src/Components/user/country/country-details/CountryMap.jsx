import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Compass,
    Globe,
    Plus,
    Minus,
    RotateCcw,
    Layers
} from "lucide-react";

// Production-grade Error Boundary — map iframe never crashes the page
class MapErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error, info) {
        console.warn("Map encountered a rendering issue:", error, info);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-full min-h-[460px] flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-slate-300">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-3">
                        <div className="w-3 h-3 rounded-full bg-[#e53935]" />
                    </div>
                    <p className="font-semibold text-sm mb-1 text-white">Regional Geography Map</p>
                    <p className="text-xs text-slate-400">Map view is operating in safe fallback mode</p>
                </div>
            );
        }
        return this.props.children;
    }
}

const CountryMap = ({
    lat,
    lng,
    zoom = 5,
    name
}) => {
    const [loaded, setLoaded] = useState(false);
    const [mapMode, setMapMode] = useState("satellite"); // 'satellite' | 'standard'
    const [currentZoom, setCurrentZoom] = useState(parseInt(zoom, 10) || 5);

    useEffect(() => {
        if (zoom) {
            setCurrentZoom(parseInt(zoom, 10) || 5);
        }
    }, [zoom]);

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    };

    // Safely parse and validate coordinates
    const parsedLat = typeof lat === "number" ? lat : parseFloat(lat);
    const parsedLng = typeof lng === "number" ? lng : parseFloat(lng);

    const isValidPosition =
        !isNaN(parsedLat) &&
        !isNaN(parsedLng) &&
        isFinite(parsedLat) &&
        isFinite(parsedLng) &&
        parsedLat >= -90 &&
        parsedLat <= 90 &&
        parsedLng >= -180 &&
        parsedLng <= 180;

    // Human-friendly coordinates display
    const formattedCoords = isValidPosition
        ? `${Math.abs(parsedLat).toFixed(4)}°${parsedLat >= 0 ? "N" : "S"}, ${Math.abs(parsedLng).toFixed(4)}°${parsedLng >= 0 ? "E" : "W"}`
        : "Coordinates Available";

    // Google Maps embed URL
    const mapQuery = name
        ? encodeURIComponent(name)
        : isValidPosition
            ? `${parsedLat},${parsedLng}`
            : null;

    const mapTypeParam = mapMode === "satellite" ? "k" : "m";

    const embedUrl = mapQuery
        ? `https://maps.google.com/maps?q=${mapQuery}&t=${mapTypeParam}&z=${currentZoom}&ie=UTF8&iwloc=&output=embed&hl=en`
        : null;

    const handleZoomIn = () => {
        setLoaded(false);
        setCurrentZoom((prev) => Math.min(prev + 1, 18));
    };

    const handleZoomOut = () => {
        setLoaded(false);
        setCurrentZoom((prev) => Math.max(prev - 1, 2));
    };

    const handleResetZoom = () => {
        setLoaded(false);
        setCurrentZoom(parseInt(zoom, 10) || 5);
    };

    const handleModeChange = (mode) => {
        if (mode !== mapMode) {
            setLoaded(false);
            setMapMode(mode);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Top Control & Title Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                    <h3 className="text-[13px] font-bold text-[#6c757d] uppercase tracking-[0.2em] whitespace-nowrap">
                        / Regional Geography
                    </h3>
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live Map
                    </span>
                </div>

                {/* Map Mode & Zoom Controls */}
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Mode Switcher: Satellite & Classic */}
                    <div className="inline-flex p-1 bg-white border border-gray-200/90 rounded-xl shadow-sm">
                        <button
                            type="button"
                            onClick={() => handleModeChange("satellite")}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                mapMode === "satellite"
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            <Globe className="w-3.5 h-3.5" />
                            Satellite
                        </button>
                        <button
                            type="button"
                            onClick={() => handleModeChange("standard")}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                mapMode === "standard"
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            <Layers className="w-3.5 h-3.5" />
                            Classic
                        </button>
                    </div>

                    {/* Interactive Zoom Controls */}
                    <div className="inline-flex items-center bg-white border border-gray-200/90 rounded-xl shadow-sm p-1">
                        <button
                            type="button"
                            onClick={handleZoomIn}
                            title="Zoom In"
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={handleZoomOut}
                            title="Zoom Out"
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={handleResetZoom}
                            title="Reset Zoom"
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                        >
                            <RotateCcw className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Map Canvas Card */}
            <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 min-h-[520px] lg:min-h-[580px] bg-slate-950 rounded-xl shadow-[0_20px_60px_-15px_rgba(2,132,199,0.18)] border border-slate-200/70 flex flex-col transition-all duration-500 group relative z-10 overflow-hidden"
            >
                {/* Map Area */}
                <div className="relative flex-1 w-full h-full min-h-[520px] lg:min-h-[580px] z-0 overflow-hidden bg-[#0c1a30]">
                    <MapErrorBoundary>
                        {embedUrl ? (
                            <>
                                {/* Loading Shimmer */}
                                {!loaded && (
                                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-900 text-white">
                                        <div className="w-10 h-10 rounded-full border-3 border-sky-500/30 border-t-sky-400 animate-spin mb-3" />
                                        <p className="text-xs font-semibold tracking-wider text-sky-200 uppercase">
                                            Loading {name} Cartography...
                                        </p>
                                    </div>
                                )}

                                {/* Google Maps iframe */}
                                <iframe
                                    title={`Cartographic view of ${name || "country"}`}
                                    src={embedUrl}
                                    style={{
                                        border: 0,
                                        display: "block",
                                        position: "absolute",
                                        inset: 0,
                                        width: "100%",
                                        height: "100%",
                                        minHeight: "520px",
                                        opacity: loaded ? 1 : 0,
                                        transition: "opacity 0.5s ease",
                                        filter:
                                            mapMode === "satellite"
                                                ? "contrast(1.08) saturate(1.15) brightness(0.97)"
                                                : "none"
                                    }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    onLoad={() => setLoaded(true)}
                                    onError={() => setLoaded(true)}
                                />

                                {/* Satellite atmospheric soft vignette */}
                                {mapMode === "satellite" && (
                                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/25 z-[2]" />
                                )}
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium text-sm">
                                Map coordinates unavailable
                            </div>
                        )}
                    </MapErrorBoundary>

                    {/* Coordinates Glass Chip — Bottom Right */}
                    <div className="absolute bottom-5 right-5 z-[20]">
                        <div className="px-3.5 py-1.5 bg-slate-950/80 backdrop-blur-md rounded-xl border border-white/20 text-slate-100 shadow-lg flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0 animate-ping" />
                            <code className="text-[11px] font-bold tracking-wider text-sky-200">
                                {formattedCoords}
                            </code>
                        </div>
                    </div>

                    {/* Geographic Accreditation Badge — Bottom Left */}
                    <div className="hidden lg:block absolute bottom-5 left-6 z-[20]">
                        <div className="px-3 py-1.5 bg-slate-950/70 backdrop-blur-md rounded-xl border border-white/10 text-[11px] text-slate-300 font-medium shadow-md flex items-center gap-2">
                            <Compass className="w-3.5 h-3.5 text-sky-400" />
                            <span>Consular Geographic Verification System</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CountryMap;