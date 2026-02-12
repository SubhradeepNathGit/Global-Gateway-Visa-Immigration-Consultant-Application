import React from 'react'
import { CreditCard, FileText, Calendar, Wallet } from "lucide-react";

const PaymentMethod = ({ paymentMethod, InfoRow }) => {

    return (
        <div className="space-y-2">
            <InfoRow
                icon={Wallet}
                label="Payment Method"
                value={paymentMethod?.payment_method === "card" ? "Credit/Debit Card" : paymentMethod?.payment_method === "upi" ? "UPI" : "Credit/Debit Card"}
            />

            {(!paymentMethod?.payment_method || paymentMethod?.payment_method === "card") && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-3 mt-3 border-t border-gray-300">
                    <InfoRow
                        icon={CreditCard}
                        label="Card Type"
                        value={paymentMethod?.card_type?.toUpperCase()??'N/A'}
                    />
                    <InfoRow
                        icon={CreditCard}
                        label="Card Number"
                        value={paymentMethod?.masked_card??'N/A'}
                        mono={true}
                    />
                    <InfoRow
                        icon={FileText}
                        label="Cardholder Name"
                        value={paymentMethod?.card_holder_name?.toUpperCase()??'N/A'}
                    />
                    <InfoRow
                        icon={Calendar}
                        label="Expiry Date"
                        value={paymentMethod?.expiry_card??'N/A'}
                        mono={true}
                    />
                </div>
            )}

            {(!paymentMethod?.payment_method || paymentMethod?.payment_method === "upi") && (
                <div className="pt-3 mt-3 border-t border-gray-300">
                    <InfoRow
                        icon={Wallet}
                        label="UPI ID"
                        value={paymentMethod?.upi_id || 'N/A'}
                        mono={true}
                    />
                </div>
            )}
        </div>
    )
}

export default PaymentMethod