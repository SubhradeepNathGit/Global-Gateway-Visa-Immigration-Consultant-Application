import React from 'react'
import { MapPin, Navigation } from "lucide-react";
import { motion } from "framer-motion";

const CountryMap = ({ lat, lng, zoom, name }) => {

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const getMapUrl = () => {
        const coords = { lat: lat, lng: lng, zoom: zoom } || { lat: 0, lng: 0, zoom: 2 };
        return `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 10},${coords.lat - 10},${coords.lng + 10},${coords.lat + 10}&layer=mapnik&marker=${coords.lat},${coords.lng}`;
    };

    return (
        <motion.div variants={itemVariants}>
            <h3 className="text-xs font-semibold text-gray-500 mb-6 uppercase tracking-widest flex items-center gap-3">
                <Navigation className="w-5 h-5 text-red-500" />
                Geographic Location
            </h3>

            <div className="relative rounded-lg overflow-hidden shadow-xl border border-gray-200 bg-white" style={{ height: '450px' }}>
                <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src={getMapUrl()}
                    style={{ border: 0 }}
                    title={`Map showing ${name}`}
                ></iframe>
            </div>

            <div className="mt-4 flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600 leading-relaxed">
                    Interactive map showing the geographical location of <span className="font-medium text-gray-900">{name}</span> and its surrounding regions.
                </p>
            </div>
        </motion.div>
    )
}

export default CountryMap