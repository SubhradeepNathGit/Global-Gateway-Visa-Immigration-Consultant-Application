import React from 'react'
import { Shield, FileText, NotepadText, NotebookPen, NotebookText, NotebookTabs, TicketPercent } from "lucide-react";

const FeeBreakDown = ({ applicationFee, serviceFee, totalAmount, discountAmount, discount, type, subtotal, total }) => {

    const emoji = [NotepadText, NotebookPen, NotebookText, Shield, NotebookTabs]

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-300">
                <div className="flex items-center gap-2">
                    <FileText size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">{type == 'visa' ? 'Application' : 'Course'} Fee</span>
                </div>
                <span className="font-semibold text-gray-900">
                    ₹{(type == 'visa' ? applicationFee : subtotal)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? 'N/A'}
                </span>
            </div>
            {Number(discount) > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-300">
                    <div className="flex items-center gap-2">
                        <TicketPercent size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-700 font-medium">Discount ({discount}%)</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                        -₹{discountAmount.toLocaleString('en-IN')}
                    </span>
                </div>
            )}
            {
                serviceFee?.map(charge => {
                    const Icon = emoji[Math.floor(Math.random() * emoji.length)];

                    return (
                        <div className="flex justify-between items-center py-2 border-b border-gray-300" key={charge?.id}>
                            <div className="flex items-center gap-2">
                                <Icon size={16} className="text-gray-400" />
                                <span className="text-sm text-gray-700 font-medium">{charge?.charge_type ?? 'N/A'} {type != 'visa' ? `(${charge?.percentage}%)` : ''}</span>
                            </div>
                            <span className="font-semibold text-gray-900">
                                {type != 'visa' ? `₹${Math?.round((subtotal - discountAmount) * (Number.parseInt(charge?.percentage)) / 100).toLocaleString('en-IN')}` :
                                    charge?.amount == '0' ? 'Free' : `₹${Number(charge?.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` ?? 'N/A'}
                            </span>
                        </div>
                    )
                })
            }

            <div className="flex justify-between items-center py-3 mt-2 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg px-4">
                <span className="text-base font-bold text-white">Total Amount to Pay</span>
                <span className="text-2xl font-bold text-white">
                    ₹{Number(type == 'visa' ? totalAmount : total)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? 'N/A'}
                </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Amount payable now</p>
        </div>
    )
}

export default FeeBreakDown