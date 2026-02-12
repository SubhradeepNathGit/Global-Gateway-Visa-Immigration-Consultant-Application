import React from 'react'
import { Calendar, Clock, Lock, Unlock } from 'lucide-react'
import { useFullCountryDetails } from '../../../tanstack/query/getCountryDetails';
import { useVisaAverages } from '../../../tanstack/query/getVisaAvgBasedOnVisaIdAndCountryId';
import { formatDays } from '../../../util/avgVisaConverter/visa-details/formatDays';
import { getApplicationBasedonCountryIdAndVisaId } from '../../../tanstack/query/getApplicationBasedonCountryIdAndVisaId';
import { useVisaOverallStatus } from '../../../tanstack/query/getVisaOverallStatus';
import { useVisaDetailsByVisaIddAndCountryId } from '../../../tanstack/query/getVisaDetailsByVisaIdAndCountryId';

const CountryVisaRow = ({ countryId, visaId }) => {

    const { data: avgDetails, isLoading: isAvgLoading, isError: hasAvgError } = useVisaAverages({ visaId, countryId });
    const { data: countryDetails, isLoading: isCountryDetailsLoading, isError: hasCountryDetailsError } = useFullCountryDetails(countryId);
    const { data: application, isLoading: isApplicationLoading, isError: hasApplicationError } = getApplicationBasedonCountryIdAndVisaId({ countryId, visaId });
    const { data: countryList, isLoading: isCountryList, isError: hasCountryListError } = useVisaDetailsByVisaIddAndCountryId(visaId, countryId);

    const { data: visaStatus, isLoading } = useVisaOverallStatus(visaId, countryId);
    return (
        <>
            <td className="px-4 py-3 text-white font-medium text-sm">{isCountryDetailsLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : countryDetails?.name ?? 'N/A'}</td>
            <td className="px-4 py-3 text-slate-300 text-sm">
                <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {formatDays(avgDetails?.avgProcessingDays) ?? 'N/A'}
                </div>
            </td>
            <td className="px-4 py-3 text-slate-300 text-sm">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {formatDays(avgDetails?.avgValidityDays) ?? 'N/A'}
                </div>
            </td>
            <td className="px-4 py-3 text-slate-300 text-sm font-medium">
                ₹{avgDetails?.avgFees ?? 'N/A'}
            </td>
            <td className="px-4 py-3 text-slate-300 text-sm font-medium">
                {isCountryList ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : countryList?.length ?? 'N/A'}
            </td>
            <td className="px-4 py-3 text-slate-300 text-sm font-medium">{isApplicationLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : application?.length ?? 'N/A'}</td>
            <td className="px-4 py-3">
                {isLoading ? (
                    <span className="text-slate-400 text-xs">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    </span>
                ) : visaStatus?.status === "active" ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium text-emerald-400 bg-emerald-500/10">
                        <Unlock className="w-3 h-3" />
                        Active
                    </span>
                ) : (
                    <div className="text-red-400 text-xs font-medium">
                        <div className="flex items-start gap-1.5">
                            <Lock className="w-3 h-3 mt-0.5" />
                            <span>
                                Blocked for:{" "}
                                {visaStatus?.blockedFor?.join(", ")}
                            </span>
                        </div>
                    </div>
                )}
            </td>
        </>
    )
}

export default CountryVisaRow