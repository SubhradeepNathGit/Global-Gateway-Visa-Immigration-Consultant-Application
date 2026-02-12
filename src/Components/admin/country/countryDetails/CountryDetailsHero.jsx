import { Building2, Globe, Plane } from 'lucide-react';
import React, { useState } from 'react'

const CountryDetailsHero = ({ country, visaCount, countryWiseVisaDetails }) => {
  const [imageError, setImageError] = useState(false);
  const [flagError, setFlagError] = useState(false);

  return (
    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
      {!imageError && country?.image_url ? (
        <>
          <img src={country?.image_url} alt={country?.name} className="w-full h-full object-cover opacity-40" onError={() => setImageError(true)} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Globe className="w-20 h-20 text-slate-700" />
        </div>
      )}

      <div className="absolute inset-0 flex items-end p-6">
        <div className="flex items-center gap-4 w-full">
          {/* Flag */}
          <div className="h-14 w-20 rounded-lg shadow-2xl border-2 border-white/20 bg-slate-800 flex items-center justify-center overflow-hidden">
            {!flagError && country?.country_details?.flag_url ? (
              <img src={country?.country_details?.flag_url} alt={`${country?.name} flag`} className="w-full h-full object-cover" onError={() => setFlagError(true)} loading="lazy" />
            ) : (
              <Globe className="w-6 h-6 text-slate-500" />
            )}
          </div>

          {/* Name */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold text-white">{country?.name || 'Unknown'}</h2>
              {country?.country_details?.code && <span className="px-2 py-1 rounded bg-slate-800/80 border border-slate-600 text-slate-300 text-xs font-mono">{country?.country_details?.code}</span>}
            </div>
            {country?.country_details?.official_name && <p className="text-slate-300 text-sm flex items-center gap-1"><Building2 className="w-3 h-3" />{country?.country_details?.official_name}</p>}
          </div>

          {/* Badges */}
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-lg border text-xs font-semibold ${!country?.is_blocked ? 'bg-green-500/20 text-green-300 border-green-500/50' : 'bg-red-500/20 text-red-300 border-red-500/50'}`}>
              {!country?.is_blocked ? '✓ Active' : '○ Inactive'}
            </span>
            <span className={`px-3 py-1 rounded-lg ${visaCount > 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'} border border-amber-500/50 text-xs font-semibold flex items-center gap-1`}>
              <Plane className="w-3 h-3" /> {visaCount > 0 ? 'Visa Available' : 'Visa Unavailable'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CountryDetailsHero