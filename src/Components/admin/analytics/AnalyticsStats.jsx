import React from 'react'
import { FileCheck, Globe, Loader2, TrendingUp, Users } from 'lucide-react'
import MetricCard from './MetricCard'
import { useApplicationStats, useApplicationStatusStats } from '../../../tanstack/query/getDashboardStats';
import { useAverageProcessingTimes } from '../../../tanstack/query/getTotalAverageProcessingTimes';
import { useCountriesStats } from '../../../tanstack/query/getCountriesCount';

const AnalyticsStats = () => {
        const { data: applicationStats, isLoading: isApplicationStatsLoading } = useApplicationStats();
        const { data: applicationStatusStats, isLoading: isApplicationStatusLoading } = useApplicationStatusStats();
        const { data: avgVisaProvessingData, isLoading: isAvgVisaProvessingData } = useAverageProcessingTimes();
        const { data: avgCountryData, isLoading: isAvgCountryData } = useCountriesStats();

    return (
        <>
            <MetricCard
                title="Total Applications"
                value={isApplicationStatsLoading ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : applicationStats?.totalApplications}
                change={isApplicationStatsLoading ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : `${applicationStats?.rate}%`}
                Icon={Users}
                iconColor="bg-blue-500/20 text-blue-400"
            />
            <MetricCard
                title="Approval Rate"
                value={isApplicationStatusLoading ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : `${applicationStatusStats?.successRate}%`}
                change={isApplicationStatusLoading ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : `${applicationStatusStats?.approvedStats.isIncrease ? "+" : "-"}${applicationStatusStats?.approvedStats.rate}%`}
                Icon={FileCheck}
                iconColor="bg-green-500/20 text-green-400"
            />
            <MetricCard
                title="Avg. Processing Time"
                value={isAvgVisaProvessingData ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : `${avgVisaProvessingData?.totalAverage} days`}
                change={isAvgVisaProvessingData ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : `${avgVisaProvessingData?.change}%`}
                Icon={TrendingUp}
                iconColor="bg-cyan-500/20 text-cyan-400"
            />
            <MetricCard
                title="Countries Served"
                value={isAvgCountryData ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : `${avgCountryData?.totalCountries }`}
                change={isAvgCountryData ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : `${avgCountryData?.monthlyChange}%`}
                Icon={Globe}
                iconColor="bg-amber-500/20 text-amber-400"
            />
        </>
    )
}

export default AnalyticsStats