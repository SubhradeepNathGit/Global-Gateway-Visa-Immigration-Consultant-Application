import React from 'react'
import { Globe, MapPin, Users, DollarSign, Languages, Plane, CheckCircle, Map, Building2, FileText, XCircle, CircleOff, ChartNetwork, Signature, CalendarCheck2, AlignEndHorizontal, CircleCheck, CircleSlash } from 'lucide-react'
import CountryDetailsContent from './countryDetails/CountryDetailsContent'
import CountryDetailsStats from './countryDetails/CountryDetailsStats'
import CountryDetailsHero from './countryDetails/CountryDetailsHero'
import { useCountryWiseVisaDetails } from '../../../tanstack/query/getCountryWiseVisaDetails'
import { useAvailableEmbassyCount } from '../../../tanstack/query/getCountryWiseEmbassyCount'
import { useCountryWiseTotalVisaCount } from '../../../tanstack/query/getCountryWiseTotalAvailableVisa'

const CountryDetailsExpanded = ({ country }) => {

    // console.log('Expand country details', country);

    const { data: countryWiseVisaDetails, isLoading: isCountryWiseVisaLoading, error: countryWiseVisaError } = useCountryWiseVisaDetails(country?.id);
    // console.log("Country wise visa details", countryWiseVisaDetails);

    const { data: count, isLoading, isError } = useAvailableEmbassyCount(country?.id);
    // console.log("Embassy count", count);

    const { data: visaData, isLoading: isVisaLoading, isError: hasVisaError } = useCountryWiseTotalVisaCount(country?.id);

    const fmt = (n) => n ? n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'N/A'

    const formatDateTime = (isoString) => {
        if (!isoString) return "N/A";

        const dateObj = new Date(isoString);

        if (isNaN(dateObj)) return "Invalid Date";

        return dateObj.toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })
    }

    const formatLatLng = (latlng) => {
        if (!latlng || latlng.length < 2) return "N/A";

        const [lat, lng] = latlng;

        const latDir = lat >= 0 ? "N" : "S";
        const lngDir = lng >= 0 ? "E" : "W";

        return `${Math.abs(lat)}°${latDir}, ${Math.abs(lng)}°${lngDir}`;
    };

    const stats = [
        { icon: Building2, label: 'Capital', value: country?.country_details?.capital || 'N/A', color: 'blue' },
        { icon: Users, label: 'Population', value: country?.country_details?.population == '0' ? country?.country_details?.population : fmt(country?.country_details?.population), color: 'amber' },
        { icon: Map, label: 'Area', value: country?.country_details?.area ? `${fmt(country?.country_details?.area)} km²` : 'N/A', color: 'blue' },
        // { icon: DollarSign, label: 'Currency', value: Object.keys(country?.country_details?.currency)?.length > 0 ? ` ${country?.country_details?.currency?.name} (${country?.country_details?.currency?.symbol})` : "N/A", color: 'green' }
        {
            icon: DollarSign, label: 'Currency', value: Object.keys(country?.country_details?.currency)?.length > 0 ? (<>
                {country?.country_details?.currency?.name}{country.country_details.currency.symbol ? ` (${country.country_details.currency.symbol})` : ""}</>) : "N/A", color: 'green'
        }
    ]

    const sections = [
        {
            title: 'Geographic',
            icon: Globe,
            color: 'blue',
            items: [
                { label: 'Continent', value: country?.country_details?.continents, icon: Globe },
                { label: 'Location', value: Object.keys(country?.country_details?.latlng).length > 0 ? formatLatLng(country?.country_details?.latlng) : null, icon: MapPin },
                { label: 'Capital', value: country?.country_details?.capital, icon: Building2 },
                { label: 'Area', value: country?.country_details?.area ? `${fmt(country?.country_details?.area)} km²` : null, icon: Map }
            ]
        },
        {
            title: 'Demographics',
            icon: Users,
            color: 'amber',
            items: [
                { label: 'Population', value: fmt(country?.country_details?.population), icon: Users },
                { label: 'Language', value: country?.country_details?.languages.join(','), icon: Languages },
                { label: 'Currency', value: Object.keys(country?.country_details?.currency)?.length > 0 ? ` ${country?.country_details?.currency?.name}` : null, icon: DollarSign },
                { label: 'Code', value: country?.country_details?.code, icon: FileText, mono: true }
            ]
        },
        {
            title: 'Travel Info',
            icon: Plane,
            color: 'blue',
            items: [
                {
                    label: 'Listed',
                    icon: CalendarCheck2,
                    value: formatDateTime(country?.created_at)
                },
                {
                    label: 'Visa',
                    icon: Signature,
                    value: isVisaLoading ? (
                        <span className="text-gray-400">Checking...</span>
                    ) : visaData > 0 ? (
                        <span className="flex items-center gap-1 text-amber-400 font-semibold">
                            <CheckCircle className="w-4 h-4" /> Available
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-red-400 font-semibold">
                            <CircleOff className="w-4 h-4" /> Not available
                        </span>
                    )
                },
                {
                    label: 'Embassy',
                    icon: AlignEndHorizontal,
                    value: count > 0 ? (
                        <span className="flex items-center gap-1 text-amber-400 font-semibold">
                            <CheckCircle className="w-4 h-4" /> Available
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-red-400 font-semibold">
                            <CircleOff className="w-4 h-4" /> Not available
                        </span>
                    )
                },
                {
                    label: 'Status',
                    icon: ChartNetwork,
                    value: !country?.is_blocked ? (
                        <span className="flex items-center gap-1 text-green-400 font-semibold">
                            <CircleCheck className="w-4 h-4" /> Active
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-red-400 font-semibold">
                            <CircleSlash className="w-4 h-4" /> Inactive
                        </span>
                    )
                }
            ]
        }
    ]

    const colors = {
        blue: 'text-blue-400 border-blue-500/30 bg-blue-500/5',
        purple: 'text-purple-400 border-purple-500/30 bg-purple-500/5',
        green: 'text-green-400',
        amber: 'text-amber-400',
        cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5'
    }

    return (
        <tr className="bg-slate-900/95">
            <td colSpan={10} className="p-0">
                <div className="border-l-4 border-gray-600">

                    {/* Hero */}
                    <CountryDetailsHero country={country} visaCount={visaData} countryWiseVisaDetails={countryWiseVisaDetails} />

                    {/* Stats */}
                    <CountryDetailsStats colors={colors} stats={stats} country={country} />

                    {/* Details */}
                    <CountryDetailsContent colors={colors} sections={sections} country={country} />

                </div>
            </td>
        </tr>
    )
}

export default CountryDetailsExpanded