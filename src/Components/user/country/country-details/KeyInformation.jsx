import React from "react";
import { Globe, Languages, MapPin, Flag, Banknote, Users, Landmark } from "lucide-react";
import { motion } from "framer-motion";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.04,
            delayChildren: 0.05
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const cleanData = (data) => {
    if (!data && data !== 0) return "---";
    if (Array.isArray(data)) {
        return data.map(val => String(val).replace(/[\[\]"]/g, '')).join(", ");
    }
    if (typeof data === "object") {
        return data.name ? `${data.name}${data.symbol ? ` (${data.symbol})` : ''}` : "---";
    }
    return String(data).replace(/[\[\]"]/g, '');
};

const formatArea = (area) => {
    if (!area) return "";
    const cleanNum = Number(String(area).replace(/[^0-9.]/g, ''));
    return cleanNum ? `${cleanNum.toLocaleString()} sq km` : String(area);
};

const formatPopulation = (pop) => {
    if (!pop) return "";
    const cleanNum = Number(String(pop).replace(/[^0-9.]/g, ''));
    return cleanNum ? cleanNum.toLocaleString() : String(pop);
};

const formatCurrency = (curr) => {
    if (!curr) return "";
    if (typeof curr === "string") return curr;
    if (curr.name) {
        return `${curr.name}${curr.symbol ? ` (${curr.symbol})` : ""}`;
    }
    return curr.code || "";
};

const InfoRow = ({ title, icon, value, className = "" }) => (
    <motion.div 
        variants={item}
        className={`flex items-center justify-between py-3.5 px-4 rounded-xl group hover:bg-gray-50/70 border-b border-gray-50 last:border-0 transition-all duration-200 ${className}`}
    >
        <div className="flex items-center gap-3.5 min-w-0 pr-3">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-[#FAFAFA] border border-gray-100/70 flex items-center justify-center group-hover:bg-[#e53935] group-hover:border-[#e53935] transition-all duration-200 shadow-sm">
                {React.cloneElement(icon, { className: "w-4.5 h-4.5 text-[#6c757d]/60 group-hover:text-white transition-colors" })}
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-none whitespace-nowrap">
                {title}
            </span>
        </div>
        <span className="text-sm font-bold text-[#2c3e50] tracking-tight text-right truncate">
            {cleanData(value)}
        </span>
    </motion.div>
);

const KeyInformation = ({ officialName, capital, continents, area, population, languages = [], currency = {}, area: rawArea }) => {
    return (
        <div className="flex flex-col">
            <div className="flex items-center mb-6">
                <h3 className="text-[13px] font-bold text-[#6c757d] uppercase tracking-[0.2em] whitespace-nowrap">
                    / Vital Statistics
                </h3>
            </div>

            <motion.div 
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.015)] border border-gray-100 p-6 sm:p-8 overflow-hidden"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-1">
                    <InfoRow
                        title="Official Name"
                        icon={<Flag />}
                        value={officialName}
                        className="md:col-span-2 pb-3.5 mb-1 border-b border-gray-100"
                    />
                    <InfoRow
                        title="Capital City"
                        icon={<Landmark />}
                        value={capital}
                    />
                    <InfoRow
                        title="Continent"
                        icon={<Globe />}
                        value={continents}
                    />
                    <InfoRow
                        title="Total Area"
                        icon={<MapPin />}
                        value={formatArea(rawArea || area)}
                    />
                    <InfoRow
                        title="Population"
                        icon={<Users />}
                        value={formatPopulation(population)}
                    />
                    <InfoRow
                        title="Primary Language"
                        icon={<Languages />}
                        value={languages}
                    />
                    <InfoRow
                        title="Local Currency"
                        icon={<Banknote />}
                        value={formatCurrency(currency)}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default KeyInformation;