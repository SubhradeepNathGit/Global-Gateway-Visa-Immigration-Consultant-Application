import React from 'react'
import CountryVisaRow from './CountryVisaRow'
import { useVisaDetailsByVisaId } from '../../../tanstack/query/getVisaDetailsByVisaId';

const CountryVisaTable = ({ visa }) => {

    const { data: visaDetails, isLoading: isVisaDetailsLoading, isError: hasVisaDetailsError } = useVisaDetailsByVisaId(visa?.id);

    let countryArr = [];

    visaDetails?.forEach(visa => {
        if (!countryArr?.includes(visa?.country_id)) {
            countryArr.push(visa?.country_id)
        }
    })

    return (
        <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-600/50 sticky top-0 z-10">
                <tr>
                    <th className="text-left px-4 py-2.5 text-slate-400 text-xs font-medium">Country</th>
                    <th className="text-left px-4 py-2.5 text-slate-400 text-xs font-medium">Processing</th>
                    <th className="text-left px-4 py-2.5 text-slate-400 text-xs font-medium">Validity</th>
                    <th className="text-left px-4 py-2.5 text-slate-400 text-xs font-medium">Fees</th>
                    <th className="text-left px-4 py-2.5 text-slate-400 text-xs font-medium">Avl. Country</th>
                    <th className="text-left px-4 py-2.5 text-slate-400 text-xs font-medium">Applications</th>
                    <th className="text-left px-4 py-2.5 text-slate-400 text-xs font-medium">Status</th>
                </tr>
            </thead>
            <tbody className="country-scroll-container">
                {isVisaDetailsLoading && (
                    <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
                        </td>
                    </tr>
                )}
                {!isVisaDetailsLoading && visaDetails?.length == 0 && (
                    <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                            No country available
                        </td>
                    </tr>
                )}
                {!isVisaDetailsLoading && visaDetails?.length > 0 && countryArr?.map((country, idx) => (
                    <tr key={idx} className="border-b border-slate-600/30 hover:bg-slate-700/20 transition-colors">
                        <CountryVisaRow countryId={country} visaId={visa?.id} />
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default CountryVisaTable