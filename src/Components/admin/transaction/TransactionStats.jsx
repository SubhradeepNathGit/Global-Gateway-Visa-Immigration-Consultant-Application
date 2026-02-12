import React from 'react'
import { DollarSign, Clock, CheckCircle, XCircle, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { useMonthlyRevenue } from '../../../tanstack/query/getMonthlyRevenue';
import { useMonthlyTransactionCount } from '../../../tanstack/query/getMonthlyTransactionCount';
import { useMonthlyTransactionsByStatus } from '../../../tanstack/query/getMonthlySuccessTransactions';

// Stat Card Component
function StatCard({ title, value, change, Icon, iconColor, isPositive }) {
    return (
        <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70 transition-all">
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <span className={`text-sm font-semibold flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {change}
                </span>
            </div>
            <div className="text-slate-400 text-sm mb-1">{title}</div>
            <div className="text-2xl font-bold text-white">{value}</div>
        </div>
    );
}

const TransactionStats = () => {

    const { data: monthlyRevenueData, isLoading: isMonthlyRevenueLoading } = useMonthlyRevenue();
    const { data: monthlyTxData, isLoading: isMonthlyTxLoading } = useMonthlyTransactionCount();
    const { data: successMonthly, isLoading: isSuccessMonthlyLoading } = useMonthlyTransactionsByStatus('success');
    const { data: failedMonthly, isLoading: isFailedMonthlyLoading } = useMonthlyTransactionsByStatus('failed');

    // console.log('Monthly Revenue Data', monthlyRevenueData);
    // console.log('Monthly Transaction Data', monthlyTxData);
    // console.log('Success stats Data', successMonthly);
    // console.log('Failed stats Data', failedMonthly);

    return (
        <>
            <StatCard
                title="Total Transactions"
                value={isMonthlyTxLoading ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : monthlyTxData[0]?.total_transactions}
                change={isMonthlyTxLoading ? <Loader2 className="w-3 h-3 text-white animate-spin mb-4" /> : monthlyTxData[0]?.percentage_change == null ? '0%' : `${monthlyTxData[0]?.percentage_change}%`}
                Icon={Clock}
                iconColor="bg-yellow-500/20 text-yellow-400"
                isPositive={true}
            />
            <StatCard
                title="Total Revenue"
                value={isMonthlyRevenueLoading ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : `₹${monthlyRevenueData[0]?.total_revenue?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                change={isMonthlyRevenueLoading ? <Loader2 className="w-3 h-3 text-white animate-spin mb-4" /> : monthlyRevenueData[0]?.percentage_change == null ? '0%' : `${monthlyRevenueData[0]?.percentage_change}%`}
                Icon={DollarSign}
                iconColor="bg-green-500/20 text-green-400"
                isPositive={true}
            />
            <StatCard
                title="Completed Transactions"
                value={isSuccessMonthlyLoading ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : successMonthly[0]?.total_transactions}
                change={isSuccessMonthlyLoading ? <Loader2 className="w-3 h-3 text-white animate-spin mb-4" /> : successMonthly[0]?.percentage_change == null ? '0%' : `${successMonthly[0]?.percentage_change}%`}
                Icon={CheckCircle}
                iconColor="bg-blue-500/20 text-blue-400"
                isPositive={true}
            />
            <StatCard
                title="Failed Transactions"
                value={isFailedMonthlyLoading ? <Loader2 className="w-8 h-8 text-white animate-spin mb-4" /> : failedMonthly[0]?.total_transactions}
                change={isFailedMonthlyLoading ? <Loader2 className="w-3 h-3 text-white animate-spin mb-4" /> : failedMonthly[0]?.percentage_change == null ? '0%' : `${failedMonthly[0]?.percentage_change}%`}
                Icon={XCircle}
                iconColor="bg-red-500/20 text-red-400"
                isPositive={false}
            />
        </>
    )
}

export default TransactionStats