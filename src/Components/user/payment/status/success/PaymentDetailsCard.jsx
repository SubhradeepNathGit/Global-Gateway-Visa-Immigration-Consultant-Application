import { CreditCard } from 'lucide-react'
import React from 'react'

const PaymentDetailsCard = ({ paymentDetails, currentDate }) => {
    return (
        <div className="bg-transparent rounded-2xl p-6 md:p-8 border border-gray-200 shadow-lg print:shadow-none print:border-0 print:border-b print:rounded-none">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CreditCard className="text-blue-600 " size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Payment Summary</h3>
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Amount Paid</span>
                    <span className="text-2xl font-bold text-gray-900">₹{Number(paymentDetails?.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Payment Method</span>
                    <span className="text-sm font-semibold text-gray-800 capitalize">
                        {paymentDetails?.payment_method === 'card' ? 'Credit/Debit Card' : 'UPI Payment'}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Transaction ID</span>
                    <span className="text-sm font-mono font-semibold text-gray-800 truncate max-w-[200px] sm:max-w-none">
                        {paymentDetails?.transaction_id}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Date & Time</span>
                    <span className="text-sm font-semibold text-gray-800">{currentDate}</span>
                </div>
            </div>
        </div>
    )
}

export default PaymentDetailsCard