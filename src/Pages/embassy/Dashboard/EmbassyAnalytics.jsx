import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AnalyticsStats from '../../../Components/embassy/dashboard/analytics/AnalyticsStats';
import RevenueTrends from '../../../Components/embassy/dashboard/analytics/charts/RevenueTrends';
import VisaTypeDistribution from '../../../Components/embassy/dashboard/analytics/charts/VisaTypeDistribution';
import ApplicationStatus from '../../../Components/embassy/dashboard/analytics/charts/ApplicationStatus';
import WeeklyPerformance from '../../../Components/embassy/dashboard/analytics/charts/WeeklyPerformance';
import TopCountries from '../../../Components/embassy/dashboard/analytics/charts/TopCountries';
import { useApplicationsByCountryId } from '../../../tanstack/query/getApplicationsByCountryId';
import { useApplicationStats } from '../../../tanstack/query/getApplicationStatsForEmbassy';
import { getMonthlyChange } from '../../../util/embassy-stats/calcMonthlyChange';
import { useCountryVisas } from '../../../tanstack/query/getCountryVisas';
import { useApplicationStatusStats } from '../../../tanstack/query/getDashboardStats';
import { useCountryTransactions } from '../../../tanstack/query/getCountryWiseRevenue';
import { useVisaTypeDistribution } from '../../../tanstack/query/getVisaTypeDistribution';
import { useApplicationStatusData } from '../../../tanstack/query/getApplicationStatusData';
import { useRevenueTrends } from '../../../tanstack/query/getRevenueTrends';
import { useWeeklyPerformance } from '../../../tanstack/query/fetchWeeklyPerformance';
import { useTopCountries } from '../../../tanstack/query/getTopCountries';


export default function EmbassyAnalytics() {
  const [timeRange, setTimeRange] = useState('yearly');
  const [chartView, setChartView] = useState('both');

  const { isuserLoading, userAuthData, userError } = useSelector(state => state.checkAuth);
  const { isEmbassyLoading, embassyData, hasEmbassyerror } = useSelector(state => state.embassy);
  const { data: allTypeApplications, isLoading: isAllTypeApplicationLoading, error: allTypeApplicationsError } = useApplicationsByCountryId(embassyData?.country_id, 'all');

  const { data: allStats = [] } = useApplicationStats({ countryId: embassyData?.country_id, statusFilter: "all" });
  const { data: applicationApprovalStatusStats, isLoading: isApplicationApprovalStatusStatusLoading } = useApplicationStatusStats(embassyData?.country_id);
  const { data, isLoading, isError } = useCountryVisas(embassyData?.country_id);

  const totalApplication = getMonthlyChange(allStats);

  // Map all visa types dynamically
  const visaWithDays = data?.visas?.map(visa => ({
    type: visa.type,
    days: Number(visa.days) || 0,
  }));

  const totalProcessingTime = visaWithDays?.reduce((sum, visa) => sum + visa.days, 0);
  const avgProcessingTime = totalProcessingTime > 0 ? Number(totalProcessingTime / data?.visas?.length)?.toFixed(0) : 0;

  const { data: totalCountryWiseRevenue, isLoading: countryWiseRevenueLoading, error } = useCountryTransactions(embassyData?.country_id);

  const { data: visaTypeDataList, isLoading: isVisaTypeDataLoading, error: hasVisaTypeDataError } = useVisaTypeDistribution();
  const { data: applicationStatusData, isLoading: isApplicationStatusLoading, error: hasApplicationErrorOccur } = useApplicationStatusData();

  const currentYear = new Date().getFullYear();
  const { data: revenueData, isLoading: isRevenueDataLoading, error: hasRevenueDataError } = useRevenueTrends(currentYear);
  const { data: weeklyData, isLoading: isweeklyDataLoading, error: hasweeklyDataError } = useWeeklyPerformance();
  const { data: countryData, isLoading: isCountryDataLoading, error: hasCountryDataError } = useTopCountries(embassyData?.country_id);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Comprehensive revenue and performance insights</p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <AnalyticsStats totalApplication={totalApplication} avgProcessingTime={avgProcessingTime} aplicationApprovalStats={applicationApprovalStatusStats} totalCountryWiseRevenue={totalCountryWiseRevenue} totalApplications={allTypeApplications?.length} />

        {/* Revenue Trends - Large Chart */}
        <RevenueTrends setChartView={setChartView} chartView={chartView} revenueData={revenueData} />

        {/* Donut and Pie Charts Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visa Type Distribution - Donut Chart */}
          <VisaTypeDistribution visaTypeData={visaTypeDataList} />

          {/* Application Status Distribution - Pie Chart */}
          <ApplicationStatus applicationStatusData={applicationStatusData} />

        </div>

        {/* Weekly Performance */}
        <WeeklyPerformance weeklyData={weeklyData} />

        {/* Top Countries Section */}
        <TopCountries countryData={countryData} />

      </div>
    </div>
  );
}