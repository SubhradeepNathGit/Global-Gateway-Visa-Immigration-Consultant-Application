import React from 'react'

const FormHeader = ({email}) => {
    return (
        <>
            {/* Email Display */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                    <p className="text-sm text-gray-700 font-medium">
                        {email}
                    </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">Receipt will be sent to this email</p>
            </div>

            {/* Credit Card Images */}
            <div className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl overflow-hidden shadow-md">
                        <img
                            src="/payment/platinum-card.png"
                            alt="Credit Card Front"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                    <div className="rounded-xl overflow-hidden shadow-md">
                        <img
                            src="/payment/card-backside.png"
                            alt="Credit Card Back"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default FormHeader