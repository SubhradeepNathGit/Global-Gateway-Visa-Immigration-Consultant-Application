import React from 'react'

const ApplicationFees = ({ applicationFee, serviceFee, totalAmount, subtotal, total, discountAmount, discount, type }) => {
    return (
        <>
            <div className="space-y-3 mb-5 pb-5 border-b border-gray-300">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{type == 'visa' ? 'Application' : 'Course'} Fee</span>
                    <span className="font-semibold text-gray-900">
                        ₹{(type == 'visa' ? applicationFee : subtotal)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? 'N/A'}
                    </span>
                </div>
                {Number(discount) > 0 && (
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Discount ({discount}%)</span>
                        <span className="font-semibold text-gray-900">
                            -₹{discountAmount.toLocaleString('en-IN')}
                        </span>
                    </div>
                )}
                {serviceFee?.map(charge => {
                    return (
                        <div className="flex justify-between items-center" key={charge?.id}>
                            <span className="text-sm text-gray-600">{charge?.charge_type ?? 'N/A'} {type != 'visa' ? `(${charge?.percentage}%)` : ''}</span>
                            <span className="font-semibold text-gray-900">
                                {type != 'visa' ? `₹${Math?.round((subtotal - discountAmount) * (Number.parseInt(charge?.percentage)) / 100).toLocaleString('en-IN')}` :
                                    charge?.amount == '0' ? 'Free' : `₹${Number(charge?.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` ?? 'N/A'}
                            </span>
                        </div>
                    )
                })
                }
            </div>

            <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl">
                <span className="text-base md:text-lg font-semibold text-white">Total Amount</span>
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                    ₹{Number(type == 'visa' ? totalAmount : total)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? 'N/A'}
                </span>
            </div>
        </>
    )
}

export default ApplicationFees