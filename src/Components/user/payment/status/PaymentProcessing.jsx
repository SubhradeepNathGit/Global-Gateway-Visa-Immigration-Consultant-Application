import React, { useState } from "react";
import { Shield, XCircle, Zap } from "lucide-react";
import Lottie from "lottie-react";
import processingAnimation from '../../../../assets/payment/processing.json'

const PaymentProcessing = ({ handleCancelPayment, processingProgress }) => {
    const [cancelBtn, setCancelBtn] = useState(false);

    return (
        <div className="fixed inset-0 w-screen h-screen 
                bg-gradient-to-b from-gray-900 via-gray-800 to-black
                flex flex-col items-center justify-center px-4 overflow-hidden font-inter">

            {/* Lottie Animation */}
            <div
                className="
                        mt-25 mb-5
                        w-auto h-auto       
                        sm:w-80 sm:h-60  
                        lg:w-100 lg:h-60   
                        flex items-center justify-center">
                <Lottie
                    animationData={processingAnimation}
                    loop
                    autoplay
                    className="w-full h-full" />
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-sm mb-10">
                <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-800 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${processingProgress}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-3 font-bold text-center">
                    {Math.round(processingProgress)}% Complete
                </p>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 text-center">
                Processing Secure Payment
            </h2>

            {/* Small Description */}
            <p className="text-base text-gray-400 mb-10 max-w-auto text-center">
                Do not close the window while we securely confirm your transaction
            </p>

            {/* Cancel Button */}
            <button
                onClick={() => {
                    handleCancelPayment();
                    setCancelBtn(true);
                }}
                disabled={cancelBtn}
                className={`px-6 py-3 border-2 border-red-500 text-red-400 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 mb-20 ${!cancelBtn?'cursor-pointer bg-transparent hover:bg-red-500/10':'cursor-not-allowed bg-red-500/10'}`}>
                <XCircle size={20} />
                Cancel Payment
            </button>

            {/* Security Indicators */}
            <div className="flex items-center justify-center gap-6 text-xs text-gray-400  mb-10">
                <span className="inline-flex items-center gap-2">
                    <Shield className="text-green-500" size={14} />
                    <span>256-bit SSL Encrypted</span>
                </span>

                <span className="inline-flex items-center gap-1.5">
                    <Zap className="text-yellow-500" size={14} />
                    <span>PCI Compliant</span>
                </span>
            </div>

        </div>
    )
}

export default PaymentProcessing