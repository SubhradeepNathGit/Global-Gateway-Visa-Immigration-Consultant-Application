import React from 'react'
import { BarChart3, Loader2, PieChart, Target } from 'lucide-react'
import { useTopVisa } from '../../../tanstack/query/getTopVisa';
import { useBestMonth } from '../../../tanstack/query/getBestMonth';
import { useTopCountry } from '../../../tanstack/query/getTopApplyingCountry';

const AdditionalStats = () => {

    const { data: topVisaData, isLoading: isTopVisaLoading } = useTopVisa();
    const { data: bestMonthData, isLoading: isBestMonthDataLoading } = useBestMonth();
    const { data: mostAppliedCountryData, isLoading: isMostAppliedCountryDataLoading } = useTopCountry();

    return (
        <>
            <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-3">
                    <Target className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-white">Top Performing Category</h3>
                </div>
                <p className="text-2xl font-bold text-white mb-1">{isTopVisaLoading ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : topVisaData?.visa_type}</p>
                <p className="text-sm text-slate-400">{isTopVisaLoading ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : topVisaData?.count.toLocaleString()} applications • {isTopVisaLoading ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : `${topVisaData?.approvalRate}%`} approval rate</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    <h3 className="font-semibold text-white">Best Month</h3>
                </div>
                <p className="text-2xl font-bold text-white mb-1">{isBestMonthDataLoading ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : bestMonthData?.monthName}</p>
                <p className="text-sm text-slate-400">{isBestMonthDataLoading ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : bestMonthData?.currentMonthCount} applications • {`${isBestMonthDataLoading ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : bestMonthData?.increase}% ${bestMonthData?.increase > 0 ? ' increase' : ' decrease'}`}</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-3">
                    <PieChart className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-semibold text-white">Top Applying Country</h3>
                </div>
                <p className="text-2xl font-bold text-white mb-1">{isMostAppliedCountryDataLoading ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : mostAppliedCountryData?.name}</p>
                <p className="text-sm text-slate-400">{isMostAppliedCountryDataLoading ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : mostAppliedCountryData?.total} applications • {isMostAppliedCountryDataLoading ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : `${mostAppliedCountryData?.successRate}% ${mostAppliedCountryData?.successRate > 0 ? ' increase' : ' decrease'}`}</p>
            </div>
        </>
    )
}

export default AdditionalStats