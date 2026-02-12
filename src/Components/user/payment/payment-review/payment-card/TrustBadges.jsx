import React from 'react'
import { CreditCard, Lock, Shield } from "lucide-react";

const TrustBadges = () => {
    return (
        <div className="pt-5 border-t border-gray-300">
            <p className="text-xs text-gray-500 text-center mb-3 font-medium">
                Secured by <span className="font-bold italic text-gray-700">PayPal</span> and Protected by
            </p>

            <div className="flex items-center justify-around">
                <div className="text-center">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-1.5">
                        <Shield size={20} className="text-green-400" />
                    </div>
                    <p className="text-xs text-gray-600 font-medium">256-bit SSL</p>
                </div>
                <div className="text-center">
                    <div className="w-10 h-10 rounded-lg bg-cyan-900/10 flex items-center justify-center mx-auto mb-1.5">
                        <Lock size={20} className="text-cyan-700" />
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Encrypted</p>
                </div>
                <div className="text-center">
                    <div className="w-10 h-10 rounded-lg bg-cyan-900/10 flex items-center justify-center mx-auto mb-1.5">
                        <CreditCard size={20} className="text-cyan-700" />
                    </div>
                    <p className="text-xs text-gray-600 font-medium">PCI-DSS</p>
                </div>
            </div>
        </div>
    )
}

export default TrustBadges