import { Calendar, Mail } from 'lucide-react'
import React from 'react'

const SuccessFooter = () => {
    return (
        <div className="pt-6 md:pt-8 border-t border-gray-200 text-center print:border-t-2 print:border-gray-400 print:pt-4">
            <p className="text-sm font-semibold text-gray-600 mb-3">
                Need help? Contact our support team
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 text-sm">
                <a href="mailto:support@globalgateway.com" className="text-gray-500 hover:text-gray-600 font-semibold flex items-center gap-2 print:text-gray-800 print:no-underline">
                    <Mail size={16} />
                    support@globalgateway.com
                </a>
                <span className="hidden sm:inline text-gray-400 print:text-gray-500">•</span>
                <a href="tel:+919098909890" className="text-gray-500 hover:text-gray-600 font-semibold flex items-center gap-2 print:text-gray-800 print:no-underline">
                    <Calendar size={16} />
                    +91-9098909890
                </a>
            </div>
        </div>
    )
}

export default SuccessFooter