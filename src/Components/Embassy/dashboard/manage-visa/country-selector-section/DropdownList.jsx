import React from 'react'
import { Ban } from 'lucide-react';

const DropdownList = ({ mockCountries, allCountryPolicy, country_id, visaData, selectedCountry, setSelectedCountry, setIsOpen, setIsAddingVisaType }) => {

    return (
        <div className="absolute z-50 w-full mt-1 bg-white/80 backdrop-blur-xl border border-white/30 rounded-lg shadow-2xl max-h-60 overflow-y-auto glass-scrollbar">
            {mockCountries?.map((country) => {

                const visaPolicy = allCountryPolicy?.filter(policy => policy?.country_id == country_id && policy?.visitor_country_id == country?.id)

                const visaRow = visaData.find(v => v.visitor_country === country.id);

                const countryVisaCount = visaRow?.visa_id?.length ?? 0;
                const hasBlocked = visaPolicy?.some(p => p.status == 'inactive');
                const isSelected = selectedCountry?.id === country?.id;

                return (
                    <button
                        key={country.id}
                        type="button"
                        onClick={() => {
                            setSelectedCountry(country);
                            setIsOpen(false);
                            setIsAddingVisaType(false);
                        }}
                        className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base
                                transition flex items-center justify-between font-medium
                                ${isSelected
                                ? 'bg-blue-500/80 backdrop-blur-sm text-white hover:bg-blue-600/80'
                                : 'text-gray-900 hover:bg-white/40 backdrop-blur-sm'}`}
                    >
                        <span>
                            {country?.name}
                            {countryVisaCount > 0
                                ? ` (${visaPolicy?.length}/${countryVisaCount} configured)`
                                : " (No visa types)"}
                        </span>
                        {hasBlocked && (
                            <span className={isSelected ? 'text-white' : 'text-red-500'}><Ban size={14} className="sm:size-4 text-red-600 outline-amber-50 outline-2 rounded-full bg-amber-50" /></span>
                        )}
                    </button>
                );
            })}
        </div>
    )
}

export default DropdownList