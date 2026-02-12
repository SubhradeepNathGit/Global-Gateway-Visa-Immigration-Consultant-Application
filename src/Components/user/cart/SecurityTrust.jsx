import React from 'react'
import { Shield, CheckCircle } from 'lucide-react';

const SecurityTrust = () => {
    return (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-sm p-5 border border-emerald-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                100% Secure & Trusted
            </h3>
            <div className="space-y-2.5 text-sm text-slate-700">
                <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>PCI DSS compliant payment</span>
                </div>
                <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Verified by 10,000+ students</span>
                </div>
            </div>
        </div>
    )
}

export default SecurityTrust