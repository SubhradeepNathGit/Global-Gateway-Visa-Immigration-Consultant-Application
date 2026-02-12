import React from "react";
import { Globe, Languages, MapPin, Flag, Banknote, Users, Landmark } from "lucide-react";
import { motion } from "framer-motion";
import VisaListDropdown from "./VisaListDropdown";

const KeyInformation = ({ officialName, capital, continents, area, population, languages = [], currency = {}, available_visa = [] }) => {

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const InfoRow = ({ title, icon, value }) => {
        return (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                        {icon}
                    </div>
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        {title}
                    </span>
                </div>
                <span className="text-gray-900 font-light text-base sm:text-lg pl-13 sm:pl-0">
                    {value}
                </span>
            </div>
        );
    };

    return (
        <motion.div variants={itemVariants}>
            <h3 className="text-xs font-semibold text-gray-500 mb-6 uppercase tracking-widest">
                Key Information
            </h3>

            <div className="space-y-6">

                {/* Official Name */}
                <InfoRow
                    title="Official Name"
                    icon={<Flag className="w-5 h-5 text-red-500" />}
                    value={officialName}
                />

                {/* Capital */}
                <InfoRow
                    title="Capital"
                    icon={<Landmark className="w-5 h-5 text-red-500" />}
                    value={capital}
                />

                {/* Region */}
                <InfoRow
                    title="Continent"
                    icon={<Globe className="w-5 h-5 text-red-500" />}
                    value={continents}
                />

                {/* Area */}
                <InfoRow
                    title="Area"
                    icon={<MapPin className="w-5 h-5 text-red-500" />}
                    value={`${area} sq km`}
                />

                {/* Population */}
                <InfoRow
                    title="Population"
                    icon={<Users className="w-5 h-5 text-red-500" />}
                    value={population?.toLocaleString()}
                />

                {/* Languages */}
                <InfoRow
                    title="Languages"
                    icon={<Languages className="w-5 h-5 text-red-500" />}
                    value={languages?.join(", ")}
                />

                {/* Currency */}
                <InfoRow
                    title="Currency"
                    icon={<Banknote className="w-5 h-5 text-red-500" />}
                    value={`${currency.name} (${currency.symbol})`}
                />

                {/* Visa Requirements Dropdown */}
                <VisaListDropdown availableVisa={available_visa} />

            </div>
        </motion.div>
    );
};

export default KeyInformation;