import { CheckCircle } from 'lucide-react'
import React from 'react'

const SuccessHeader = ({ paymentDetails, type }) => {
    return (
        <div className="relative bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-700 px-6 md:px-12 py-12 md:py-16 lg:py-20 text-center shadow-lg print:p-8 print:py-12 print:bg-none print:shadow-none print:border-b-4 print:border-cyan-500">
            <div className="relative max-w-4xl mx-auto">
                <div className="inline-flex mb-6 print:hidden">
                    <div className="relative">
                        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
                        <div
                            className="relative w-30 h-30 rounded-full flex items-center justify-center backdrop-blur-md bg-white/20 shadow-xl border border-white/40"
                        >
                            <CheckCircle
                                size={80}
                                className="text-white"
                            />
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white print:text-gray-900 mb-3 md:mb-4">
                    Transaction Successful!
                </h1>
                <p className="text-base mb-5 md:text-lg lg:text-xl text-white print:text-gray-600 max-w-auto mx-auto">
                    {type == 'visa' ? 'Your visa application has been successfully submitted and processed' :
                        'You have successfully purchased your selected course'}
                </p>

                <div className="inline-flex flex-col items-center gap-1.5 px-4 md:px-6 py-3 bg-white/20 print:bg-gray-100 print:border print:border-gray-300 print:shadow-inner backdrop-blur-sm rounded-xl mt-4 border border-white/30">
                    <span className="text-xs md:text-sm text-white/50 print:text-gray-600 font-medium uppercase tracking-widest">Transaction ID</span>
                    <span className="text-md md:text-xl font-mono font-semibold text-white print:text-cyan-700 tracking-wide">
                        {paymentDetails?.transaction_id}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default SuccessHeader