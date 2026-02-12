import React from 'react'
import { Ban, ChevronDown } from 'lucide-react'

const DropdownBtn = ({ setIsOpen, isOpen, visaPolicy, visaData, selectedCountry }) => {

  const visaRow = visaData?.find(v => v?.visitor_country === selectedCountry?.id);
  const countryVisaCount = visaRow?.visa_id?.length ?? 0;

  const visaPolicyCount = visaPolicy?.length ?? 0;

  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className="w-full appearance-none rounded-lg border border-white bg-white backdrop-blur-sm
        px-3 sm:px-4 py-2.5 sm:py-3
        text-sm sm:text-base text-gray-900 text-left
        focus:outline-none focus:ring-2 focus:ring-blue-400/50
        transition hover:bg-white/30 hover:border-white/40 flex items-center justify-between
        shadow-sm"
    >
      <span className="flex items-center gap-2 font-medium">
        {selectedCountry?.name}
        {countryVisaCount > 0 &&
          ` (${visaPolicyCount}/${countryVisaCount
          } configured)`}
        {countryVisaCount === 0 &&
          " (No visa types)"}
        {visaPolicy?.some(p => p.status == 'inactive') && (
          <span className="text-red-500"><Ban size={14} className="sm:size-4" /></span>
        )}
      </span>
      <ChevronDown
        className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-600 transition-transform ${isOpen ? 'transform rotate-180' : ''
          }`}
      />
    </button>
  )
}

export default DropdownBtn