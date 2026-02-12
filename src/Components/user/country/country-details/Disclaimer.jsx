import React from 'react'

const Disclaimer = () => {
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 mt-8">
            <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-6 h-6 rounded-full bg-white border-2 border-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-500 text-xs font-bold">!</span>
                </div>
                <div>
                    <h4 className="font-medium text-gray-900 mb-2 text-sm uppercase tracking-wide">Important Notice</h4>
                    <p className="text-gray-600 text-sm leading-relaxed font-light">
                        Visa requirements and immigration regulations are subject to change without notice. We strongly recommend consulting with our certified visa specialists for the most current and accurate information pertaining to your specific situation.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Disclaimer