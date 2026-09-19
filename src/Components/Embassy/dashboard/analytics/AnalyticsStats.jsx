import React from 'react'
import { Activity, DollarSign, FileText, TrendingUp, Users } from 'lucide-react'

const AnalyticsStats = ({ totalApplication, aplicationApprovalStats, avgProcessingTime, totalCountryWiseRevenue, totalApplications }) => {
    const rawRevenue = totalCountryWiseRevenue?.[0]?.total_amount;
    const rawTransactions = totalCountryWiseRevenue?.[0]?.total_transactions;

    const totalRevenueAmount = (rawRevenue !== null && rawRevenue !== undefined && !isNaN(rawRevenue)) ? Number(rawRevenue) : 0;
    const totalTransactionsCount = (rawTransactions !== null && rawTransactions !== undefined && !isNaN(rawTransactions)) ? Number(rawTransactions) : 0;

    // Format revenue value: ₹0 initially, or e.g. ₹50K / ₹1,200 once loaded
    const displayRevenue = totalRevenueAmount > 0
        ? (totalRevenueAmount >= 1000 
            ? `₹${(totalRevenueAmount / 1000).toFixed(totalRevenueAmount % 1000 === 0 ? 0 : 1)}K` 
            : `₹${totalRevenueAmount.toLocaleString()}`)
        : '₹0';

    // Average revenue per application: ₹0/application initially
    const avgPerApp = (totalRevenueAmount > 0 && totalTransactionsCount > 0)
        ? (totalRevenueAmount / totalTransactionsCount >= 1000
            ? `₹${((totalRevenueAmount / totalTransactionsCount) / 1000).toFixed(1)}K/application`
            : `₹${Math.round(totalRevenueAmount / totalTransactionsCount)}/application`)
        : '₹0/application';

    const safeApplications = Number(totalApplications) || 0;
    const avgPerMonth = safeApplications > 0 ? Math.round(safeApplications / 12) : 0;

    const approvalSuccessRate = aplicationApprovalStats?.successRate;
    const displayApprovalRate = (approvalSuccessRate !== null && approvalSuccessRate !== undefined && !isNaN(approvalSuccessRate))
        ? `${approvalSuccessRate}%`
        : '0%';

    const approvedCount = aplicationApprovalStats?.approvedStats?.totalApproved ?? 0;

    const safeProcessingTime = Number(avgProcessingTime) || 0;
    const processingTimeText = `${safeProcessingTime} ${safeProcessingTime === 1 ? 'day' : 'days'}`;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
                {
                    icon: DollarSign,
                    title: 'Total Revenue',
                    value: displayRevenue,
                    change: `+50%`,
                    subtitle: `Avg: ${avgPerApp}`,
                    bgColor: 'bg-blue-50',
                    iconBg: 'bg-blue-600'
                },
                {
                    icon: FileText,
                    title: 'Total Applications',
                    value: safeApplications.toLocaleString(),
                    change: totalApplication?.changeText,
                    subtitle: `Avg: ${avgPerMonth}/month`,
                    bgColor: 'bg-green-50',
                    iconBg: 'bg-green-600'
                },
                {
                    icon: Users,
                    title: 'Approval Rate',
                    value: displayApprovalRate,
                    change: '+8.2%',
                    subtitle: `${approvedCount} approved this year`,
                    bgColor: 'bg-purple-50',
                    iconBg: 'bg-purple-600'
                },
                {
                    icon: Activity,
                    title: 'Avg Processing Time',
                    value: processingTimeText,
                    change: '+5.1%',
                    subtitle: 'Target: 5 days',
                    bgColor: 'bg-orange-50',
                    iconBg: 'bg-orange-600'
                }
            ].map((card, idx) => (
                <div
                    key={idx}
                    className={`${card.bgColor} border border-gray-200 rounded-xl shadow-sm hover:shadow-md p-5 sm:p-6 transition-all duration-300`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                            <card.icon className="w-6 h-6 text-white" />
                        </div>
                        {/* <span className="flex items-center gap-1 text-xs font-semibold bg-green-50 px-3 py-1.5 rounded-full border border-green-200 text-green-700">
                            <TrendingUp className="w-3 h-3" />
                            {card.change}
                        </span> */}
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{card.title}</p>
                    <p className="text-3xl font-bold mt-2 text-gray-900">{card.value}</p>
                    <p className="text-xs mt-2 text-gray-500">{card.subtitle}</p>
                </div>
            ))}
        </div>
    )
}

export default AnalyticsStats