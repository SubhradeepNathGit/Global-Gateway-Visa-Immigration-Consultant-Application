import React from 'react'
import { UserChart } from '../common/charts/UserChart';
import { RevenueChart } from '../common/charts/RevenueChart'
import { useApplicationStats } from '../../../tanstack/query/getDashboardStats';
import { useApprovalStats } from '../../../tanstack/query/getApprovalStats';
import DashboardStatCard from './DashboardStatCard';

const DashboardChart = () => {
    const { data: applicationStats, isLoading: isApplicationStatsLoading } = useApplicationStats();
    const { data: approvalStats, isLoading: isApprovalStatsLoading } = useApprovalStats();

    return (
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">

            {/* Application Stats */}
            <DashboardStatCard
                title="Application Volume"
                value={applicationStats?.totalApplications ?? 0}
                delta={`${applicationStats?.rate ?? 0}%`}
                isLoading={isApplicationStatsLoading}
            >
                <UserChart />
            </DashboardStatCard>

            {/* Approval Stats */}
            <DashboardStatCard
                title="Approval Rate"
                value={`${approvalStats?.approvalRate ?? 0}%`}
                delta={`${approvalStats?.delta > 0 ? "+" : ""}${approvalStats?.delta ?? 0}%`}
                isLoading={isApprovalStatsLoading}
            >
                <RevenueChart />
            </DashboardStatCard>
        </div>
    );
};


export default DashboardChart