import React from "react";
import { Mail, Home, CreditCard, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentFailed = ({ handleRetryPayment, currentDate, totalAmount }) => {
    return (
        <div className="min-h-screen bg-gray-50 font-inter">

            {/* Header Section*/}
            <div className="relative bg-gradient-to-br from-red-600 via-rose-600 to-red-700 px-6 md:px-12 py-12 md:py-16 text-center shadow-lg">
                <div className="relative max-w-4xl mx-auto">
                    <div className="inline-flex mb-6">
                        <div className="w-20 h-20 md:w-30 md:h-30 bg-white/80 rounded-full flex items-center justify-center shadow-2xl">
                            <XCircle className="text-red-500" size={80} />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                        Transaction Failed
                    </h1>
                    <p className="text-base md:text-lg text-red-100">
                        Your payment could not be processed or was cancelled
                    </p>
                </div>
            </div>

            {/* White Content Section - Full Width */}
            <div className="bg-white px-4 md:px-6 lg:px-12 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-10 shadow-sm">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h3 className="font-bold text-red-900 mb-2">Error Details</h3>
                                <p className="text-sm text-red-800 mb-3">
                                    The transaction was <span className="font-bold">cancelled or failed </span> due to an unexpected error. No charges have been applied to your card or bank account.
                                </p>

                                <p className="text-xs text-red-700">
                                    <strong>Time:</strong> {currentDate}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-10 p-6 border border-gray-100 rounded-xl bg-white shadow-lg">
                        <h3 className="font-bold text-xl text-gray-900 mb-5">What to do?</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <RefreshCw className="text-red-600" size={16} />
                                </div>
                                <p className="text-sm text-gray-700 pt-1">
                                    <span className="font-semibold">Retry Payment : </span> Click the button below to attempt the transaction again. Check your card details carefully.
                                </p>

                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <CreditCard className="text-red-600" size={16} />
                                </div>
                                <p className="text-sm text-gray-700 pt-1">
                                    <span className="font-semibold">Verify Funds : </span> Ensure your card or bank account has sufficient balance for the transaction amount (₹{Number(totalAmount)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}).
                                </p>

                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Mail className="text-red-600" size={16} />
                                </div>
                                <p className="text-sm text-gray-700 pt-1">
                                    <span className="font-semibold">Contact Support : </span> If the issue persists, contact our support team immediately for assistance.
                                </p>

                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <button
                            onClick={handleRetryPayment}
                            className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <RefreshCw size={20} />
                            Retry Payment
                        </button>
                        <Link to="/"
                            className="flex-1 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Home size={20} />
                            Go to Home
                        </Link>
                    </div>

                    <div className="pt-8 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-600 mb-2">Need immediate assistance?</p>
                        <a href="mailto:support@globalgateway.com" className="text-red-600 hover:text-red-700 font-semibold text-sm inline-flex items-center gap-1">
                            <Mail size={16} />
                            support@globalgateway.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentFailed