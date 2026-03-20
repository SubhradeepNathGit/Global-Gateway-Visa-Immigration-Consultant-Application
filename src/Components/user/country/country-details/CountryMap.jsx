import React from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix React-Leaflet icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 2026 Premium Custom HTML Marker Badge
const createPremiumBadge = (name) => {
    return L.divIcon({
        className: 'bg-transparent',
        html: `
            <div class="px-5 py-3 bg-transparent backdrop-blur-xl  flex items-center gap-3 transition-all duration-300 w-max" style="transform: translate(-15%, -110%); min-width: 150px;">
                <div class="relative flex items-center justify-center shrink-0">
                    <div class="w-2.5 h-2.5 rounded-full bg-[#e53935] shadow-[0_0_12px_rgba(229,57,53,0.8)] z-10"></div>
                    <div class="absolute w-5 h-5 rounded-full border-2 border-[#e53935] animate-ping opacity-60"></div>
                </div>
                <span class="text-[11px] font-black text-[#2c3e50] tracking-[0.2em] uppercase mt-0.5 whitespace-nowrap">${name} Center</span>
            </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
    });
};

const CountryMap = ({ lat, lng, zoom = 5, name }) => {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    };

    const position = lat && lng ? [lat, lng] : null;

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center mb-6">
                <h3 className="text-[13px] font-bold text-[#6c757d] uppercase tracking-[0.2em] whitespace-nowrap">
                    / Regional Geography
                </h3>
            </div>

            <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 min-h-[520px] bg-white rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col transition-all duration-500 group relative z-10 overflow-hidden"
            >
                {/* Map Area */}
                <div className="relative flex-grow h-full w-full bg-[#EAE8E2] z-0">
                     
                    {/* Premium Subtle Scan Line Overlay */}
                    <div className="absolute inset-0 z-[400] pointer-events-none rounded-[2rem] overflow-hidden">
                        <motion.div 
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#e53935]/15 to-transparent w-full"
                        />
                    </div>

                    {position ? (
                        <MapContainer 
                            center={position} 
                            zoom={zoom} 
                            scrollWheelZoom={true}
                            zoomControl={false}
                            attributionControl={false}
                            style={{ height: "100%", width: "100%", zIndex: 0 }}
                            className="w-full h-full min-h-[460px] grayscale-[0.2] contrast-[1.02] brightness-[1.01] group-hover:grayscale-0 transition-all duration-1000"
                        >
                            {/* Premium CARTO Voyager tiles (OpenStreetMap-based) */}
                            <TileLayer
                                attribution='&copy; <a href="https://carto.com/" target="_blank" class="text-xs">CARTO</a> &copy; <a href="https://www.openstreetmap.org/" target="_blank" class="text-xs">OSM</a>'
                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            />
                            <Marker position={position} icon={createPremiumBadge(name)} />
                        </MapContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#6c757d] font-medium text-sm">
                            Map coordinates unavailable
                        </div>
                    )}

                    {/* Coordinates Overlay Overlay */}
                    <div className="absolute bottom-6 right-6 z-[500] pointer-events-none">
                        <div className="px-5 py-2.5 bg-[#2c3e50]/80 backdrop-blur-md rounded-[1rem] shadow-xl border border-white/10 flex items-center transition-all duration-300 group-hover:bg-[#e53935]">
                            <code className="text-[10px] font-bold text-white tracking-widest uppercase mt-0.5">
                                {lat ? lat.toFixed(4) : "0.0000"}°N, {lng ? lng.toFixed(4) : "0.0000"}°E
                            </code>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CountryMap;