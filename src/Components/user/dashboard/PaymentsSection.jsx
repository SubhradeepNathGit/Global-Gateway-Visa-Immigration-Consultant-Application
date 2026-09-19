import React, { useMemo } from 'react';
import { CreditCard } from 'lucide-react';
import { formatTransactionDate } from '../../../util/dateFormat/dateFormatConvertion';
import Skeleton from '../../Skeleton';
import { useVisaDetailsByApplicationId } from '../../../tanstack/query/getApplicationVisaDetails';
import { useCountryByApplicationId } from '../../../tanstack/query/getCountryByApplicationId';

const PaymentItem = ({ payment, getStatusColor, getStatusIcon }) => {
    const { data: visaData } = useVisaDetailsByApplicationId(payment?.application_id);
    const { data: countryDetails } = useCountryByApplicationId(visaData?.application_id || payment?.application_id);

    const title = payment?.txn_for === "course"
        ? payment.courses?.map((txn, index) => (
            <span key={index}> {txn?.course_name} <br /> </span>
        ))
        : `${countryDetails?.name || ''} ${visaData?.visa_type || ''}`.trim() || 'Visa Application';

    return (
        <div className="border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                        {payment?.currency === 'Rupee' ? '₹' : ''} {payment?.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(payment?.status)}`}>
                    {getStatusIcon(payment?.status)}
                    {payment?.status ? (payment.status.charAt(0).toUpperCase() + payment.status.slice(1)) : ''}
                </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-slate-600">
                <div><span className="font-medium text-slate-700">Transaction ID:</span> {payment?.transaction_details?.transaction_id || payment?.transaction_id}</div>
                <div><span className="font-medium text-slate-700">Payment Mode:</span> {payment?.transaction_details?.payment_method === "card" ? "Card" : "UPI"}</div>
                <div><span className="font-medium text-slate-700">Date:</span> {formatTransactionDate(payment?.purchase_date || payment?.payment_date || payment?.created_at)}</div>
            </div>
        </div>
    );
};

const PaymentsSection = ({ transactions, getStatusColor, getStatusIcon, isLoading }) => {
    // Only show one payment record per visa / transaction
    const uniqueTransactions = useMemo(() => {
        if (!Array.isArray(transactions) || transactions.length === 0) return [];

        const seen = new Set();
        const result = [];

        for (const payment of transactions) {
            const key = payment?.txn_for === 'course'
                ? (payment?.transaction_id || payment?.id)
                : (payment?.application_id || payment?.transaction_id || payment?.id);

            if (key && !seen.has(key)) {
                seen.add(key);
                result.push(payment);
            }
        }

        return result;
    }, [transactions]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="border border-slate-200 rounded-lg p-6 animate-pulse">
                        <div className="flex items-start justify-between mb-3">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-64" />
                                <Skeleton className="h-8 w-24" />
                            </div>
                            <Skeleton className="h-8 w-24 rounded-full" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!uniqueTransactions || uniqueTransactions.length === 0) {
        return (
            <div className="py-12 px-4">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
                        <CreditCard className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-gray-600 text-lg">No payment details available</p>
                    <p className="text-gray-400 text-sm mt-1">
                        Your upcoming payments will appear here
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {uniqueTransactions.map(payment => (
                <PaymentItem
                    key={payment?.id || payment?.application_id || payment?.transaction_id}
                    payment={payment}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                />
            ))}
        </div>
    );
};

export default PaymentsSection;