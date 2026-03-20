import React from "react";
import { Globe, Languages, MapPin, Flag, Banknote, Users, Landmark } from "lucide-react";
import { motion } from "framer-motion";

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    const cleanData = (data) => {
        if (!data) return "---";
        if (Array.isArray(data)) {
            return data.map(val => String(val).replace(/[\[\]"]/g, '')).join(", ");
        }
        return String(data).replace(/[\[\]"]/g, '');
    };

    const InfoRow = ({ title, icon, value }) => (
        <motion.div 
            variants={item}
            className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 group hover:bg-gray-50/10 px-4 rounded-xl transition-all duration-300"
        >
            <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#FAFAFA] flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all shadow-sm">
                    {React.cloneElement(icon, { className: "w-4.5 h-4.5 text-[#6c757d]/50 group-hover:text-[#e53935] transition-colors" })}
                </div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-none">
                    {title}
                </span>
            </div>
            <span className="text-sm font-bold text-[#2c3e50] tracking-tight">
                {cleanData(value)}
            </span>
        </motion.div>
    );

const KeyInformation = ({ officialName, capital, continents, area, population, languages = [], currency = {}, area: rawArea }) => {

    // Render body

    return (
        <div className="h-full flex flex-col">
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
                className="flex-1 min-h-[520px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.015)] border border-gray-100 p-6 flex flex-col justify-between overflow-hidden"
            >
                <div className="divide-y divide-gray-50">
                    <InfoRow
                        title="Official Name"
                        icon={<Flag />}
                        value={officialName}
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
                        value={rawArea ? `${rawArea?.toLocaleString()} sq km` : ""}
                    />
                    <InfoRow
                        title="Population"
                        icon={<Users />}
                        value={population?.toLocaleString()}
                    />
                    <InfoRow
                        title="Primary Language"
                        icon={<Languages />}
                        value={languages}
                    />
                    <InfoRow
                        title="Local Currency"
                        icon={<Banknote />}
                        value={currency?.name ? `${currency.name} (${currency.symbol})` : ""}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default KeyInformation;