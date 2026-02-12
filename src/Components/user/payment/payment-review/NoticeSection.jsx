import React from 'react'
import { AlertCircle } from 'lucide-react'

const NoticeSection = () => {
    return (
        <div className="bg-cyan-900/5 border border-cyan-700/30 rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <AlertCircle className="text-cyan-700" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-cyan-900 mb-2 text-sm sm:text-base">Important Notice</h4>
                    <p className="text-xs sm:text-sm text-cyan-800 leading-relaxed">
                        Please carefully review all payment information before proceeding. Once payment is processed,
                        you cannot modify these details. All fees are non-refundable.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default NoticeSection