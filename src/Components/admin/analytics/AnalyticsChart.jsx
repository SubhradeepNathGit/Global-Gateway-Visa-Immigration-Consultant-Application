import React from 'react'
import AnalyticsChartCard from './AnalyticsChartCard'
import { MonthlyComparisonChart } from './chart/MonthlyComparisonChart'
import { VisaTypeChart } from './chart/VisaTypeChart'
import { RevenueChart } from '../common/charts/RevenueChart'
import { UserChart } from '../common/charts/UserChart'

const AnalyticsChart = () => {

    return (
        <>
            {/* Application Trends */}
            <AnalyticsChartCard
                title="Application Trends"
                subtitle="Monthly application volume over the year"
            >
                <UserChart />
            </AnalyticsChartCard>

            {/* Approval Rate */}
            <AnalyticsChartCard
                title="Approval Rate Trends"
                subtitle="Success rate percentage by month"
            >
                <RevenueChart />
            </AnalyticsChartCard>

            {/* Year Comparison */}
            <AnalyticsChartCard
                title="Year-over-Year Comparison"
                subtitle="Compare current vs previous year performance"
            >
                <MonthlyComparisonChart />
            </AnalyticsChartCard>

            {/* Visa Type Distribution */}
            <AnalyticsChartCard
                title="Visa Type Distribution"
                subtitle="Applications breakdown by visa category"
            >
                <VisaTypeChart />
            </AnalyticsChartCard>
        </>
    )
}

export default AnalyticsChart