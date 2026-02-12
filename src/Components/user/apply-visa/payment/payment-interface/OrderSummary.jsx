import React, { useState } from "react";
import { ArrowLeft, CheckCircle, Lock } from "lucide-react";

const OrderSummary = ({ onBack, allCharges, visaData, visaSpecification, application_fees, total_amount }) => {

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 lg:p-12 flex flex-col lg:overflow-hidden">
            <button
                onClick={onBack}
                className=" flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8 group w-fit cursor-pointer"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Review</span>
            </button>

            <div className="mb-3 -mt-7">
                <div className="flex items-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                        <img
                            src="/payment/paypal-logo.png"
                            className="w-16 h-16 md:w-20 md:h-20 object-contain -ml-10"
                        />
                    </div>


                    <div className="-ml-10">
                        <p className="text-sm text-gray-400">Secure Payment by </p>
                        <h3 className="text-lg font-bold italic ">PayPal</h3>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 shadow-xl backdrop-blur-sm">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{visaData?.visa_type??'N/A'}</h2>
                        <p className="text-gray-400 text-sm">Standard processing time</p>
                    </div>
                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
                        {visaSpecification?.visa_processing_time??'N/A'}
                    </div>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-700/50">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <CheckCircle size={16} className="text-green-400 flex-shrink-0" strokeWidth={2.5} />
                        <span>Document verification included</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <CheckCircle size={16} className="text-green-400 flex-shrink-0" strokeWidth={2.5} />
                        <span>Application status tracking</span>
                    </div>

                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Application Fee</span>
                        <span className="font-semibold">₹{Number(application_fees)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })??'N/A'}</span>
                    </div>
                    {
                        allCharges?.map(charge => (
                            <div className="flex justify-between items-center" key={charge?.id}>
                                <span className="text-gray-400 text-sm">{charge?.charge_type}</span>
                                <span className="font-semibold">{charge?.amount == '0' ? 'Free' : `₹${Number(charge?.amount)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`??'N/A'}</span>
                            </div>
                        ))
                    }

                    <div className="border-t border-gray-700 pt-4 mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total Amount</span>
                            <span className="text-3xl font-bold text-white">₹{Number(total_amount)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })??'N/A'}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Amount payable now</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-xs mt-auto pt-8">
                <Lock size={14} className="flex-shrink-0" />
                <span>Payments secured with 256-bit SSL encryption</span>
            </div>
        </div>
    )
}

export default OrderSummary