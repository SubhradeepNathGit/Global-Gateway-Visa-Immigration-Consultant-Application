import React from 'react'
import { Activity, DollarSign, FileText, TrendingUp, Users } from 'lucide-react'

const AnalyticsStats = ({ totalApplication, aplicationApprovalStats, avgProcessingTime, totalCountryWiseRevenue, totalApplications }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
                {
                    icon: DollarSign,
                    title: 'Total Revenue',
                    value: `₹${(totalCountryWiseRevenue?.[0]?.total_amount / 1000).toFixed(0)}K`,
                    change: `+50%`,
                    subtitle: `Avg: ₹${(totalCountryWiseRevenue?.[0]?.total_amount / totalCountryWiseRevenue?.[0]?.total_transactions).toFixed(1)}K/application`,
                    bgColor: 'bg-blue-50',
                    iconBg: 'bg-blue-600'
                },
                {
                    icon: FileText,
                    title: 'Total Applications',
                    value: totalApplications?.toLocaleString() ?? 0,
                    change: totalApplication?.changeText,
                    subtitle: `Avg: ${Math.round(totalApplications / 12) ?? 0}/month`,
                    bgColor: 'bg-green-50',
                    iconBg: 'bg-green-600'
                },
                {
                    icon: Users,
                    title: 'Approval Rate',
                    value: aplicationApprovalStats?.successRate ?? 0 + '%',
                    change: '+8.2%',
                    subtitle: (aplicationApprovalStats?.approvedStats?.totalApproved ?? 0) + ' approved this year',
                    bgColor: 'bg-purple-50',
                    iconBg: 'bg-purple-600'
                },
                {
                    icon: Activity,
                    title: 'Avg Processing Time',
                    value: avgProcessingTime + `${avgProcessingTime > 1 ? ' days' : ' day'}`,
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