import React from 'react';
import { ChevronDown, ChevronRight, Edit, Ban, Globe, CircleCheck } from 'lucide-react';
import CountryDetailsExpanded from './CountryDetailsExpanded';

const CountryRow = ({ country, setSelectedCountry, setIsModalOpen, setCountries, countries, expandedCountryId, setExpandedCountryId, handleBlock }) => {
    const isExpanded = expandedCountryId === country.id;
    const Icon = !country.is_blocked ? Ban : CircleCheck;

    const handleToggleExpand = () => {
        setExpandedCountryId(isExpanded ? null : country.id);
    };

    // console.log('Country row details', country);

    return (
        <>
            {/* MAIN ROW */}
            <tr className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                {/* CHEVRON COLUMN - Expandable */}
                <td className="p-4">
                    <button
                        onClick={handleToggleExpand}
                        className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                        {isExpanded ? (
                            <ChevronDown className="w-5 h-5" />
                        ) : (
                            <ChevronRight className="w-5 h-5" />
                        )}
                    </button>
                </td>

                {/* COUNTRY */}
                <td className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-6 rounded overflow-hidden bg-slate-700 flex items-center justify-center flex-shrink-0">
                            {country?.country_details?.flag_url ? (
                                <img
                                    src={country?.country_details?.flag_url}
                                    alt={`${country?.name} flag`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Globe className="w-4 h-4 text-slate-400" />
                            )}
                        </div>

                        <div className="min-w-0">
                            <div className="text-sm font-medium text-white truncate">
                                {country?.name ? country?.name.length > 12 ? country?.name?.slice(0, 13) + '...' : country?.name : 'N/A'}
                            </div>
                            <div className="text-xs text-slate-400 truncate">
                                {country?.country_details?.official_name ? country?.country_details?.official_name?.length > 20 ? country?.country_details?.official_name?.slice(0, 21) + '...' : country?.country_details?.official_name : 'N/A'}
                            </div>
                        </div>
                    </div>
                </td>

                {/* CODE */}
                <td className="p-4">
                    <span className="text-sm text-slate-300 font-mono">
                        {country?.country_details?.code ? country?.country_details?.code : 'N/A'}
                    </span>
                </td>

                {/* CONTINENT */}
                <td className="p-4 text-sm text-slate-300">{country?.country_details?.continents ? country?.country_details?.continents : 'N/A'}</td>

                {/* CAPITAL */}
                <td className="p-4 text-sm text-slate-300">{country?.country_details?.capital ? country?.country_details?.capital?.length > 10 ? country?.country_details?.capital?.slice(0, 11) + '...' : country?.country_details?.capital : 'N/A'}</td>

                {/* CURRENCY */}
                <td className="p-4 text-sm text-slate-300">{country?.country_details?.currency &&
                    Object.keys(country.country_details.currency).length > 0 ? (<>
                        {country.country_details.currency.code}{country.country_details.currency.symbol ? ` (${country.country_details.currency.symbol})`
                            : ""}</>) : ("N/A")}</td>

                {/* LANGUAGE */}
                <td className="p-4 text-sm text-slate-300">{country?.country_details?.languages ? country?.country_details?.languages[0] : 'N/A'}</td>

                {/* STATUS */}
                <td className="p-4">
                    <div className="flex flex-col gap-1">
                        <span
                            className={`px-2 py-0.5 rounded-full border text-xs inline-block w-fit whitespace-nowrap ${!country?.is_blocked
                                ? "bg-green-500/20 text-green-400 border-green-500/30 px-4"
                                : "bg-red-500/20 text-red-400 border-red-500/30 px-3"
                                }`}
                        >
                            {!country?.is_blocked ? "Active" : "Inactive"}
                        </span>
                        {country?.visa_required && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs inline-block w-fit whitespace-nowrap">
                                Visa Required
                            </span>
                        )}
                    </div>
                </td>

                {/* ACTIONS */}
                <td className="p-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                setSelectedCountry(country);
                                setIsModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit"
                        >
                            <Edit className="w-4 h-4" />
                        </button>

                        {/* <button
                            onClick={() => handleBlock(country?.id, country?.is_blocked)}
                            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete">
                            <Ban className="w-4 h-4" />
                        </button> */}

                        <button
                            onClick={() => handleBlock(country?.id, country?.is_blocked)}
                            className={`p-2 rounded-lg border transition-all ${country.is_blocked
                                ? "bg-green-600/20 hover:bg-green-600/30 border-green-500/30 text-green-400"
                                : "bg-red-600/20 hover:bg-red-600/30 border-red-500/30 text-red-400"} ${country.is_verified === "pending" ? 'cursor-not-allowed bg-red-600/50 hover:bg-red-600/50 text-red-500' : 'cursor-pointer'}`}
                            title={!country.is_blocked ? "Block access" : "Restore access"} disabled={country.is_verified === "pending"}>
                            <Icon className="w-4 h-4" />
                        </button>
                    </div>
                </td>
            </tr>

            {/* EXPANDED ROW */}
            {isExpanded && <CountryDetailsExpanded country={country} />}
        </>
    );
};

export default CountryRow;