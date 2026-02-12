import React from 'react'
import TrustBadges from './payment-card/TrustBadges'
import ApplicationFees from './payment-card/ApplicationFees'
import ApplicationInfo from './payment-card/ApplicationInfo'

const PaymentSummaryCard = ({ personalInfo, applicationFee, serviceFee, totalAmount, visaData, visaSpecification, cartItems,
    subtotal, total, discountAmount, discount, type }) => {

    return (
        <>
            <div className="bg-white rounded-xl shadow-lg border border-gray-300 p-4 sm:p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 pb-4 border-b border-gray-300">
                    Payment Summary
                </h3>

                {/* Application Fees  */}
                <ApplicationFees applicationFee={applicationFee} serviceFee={serviceFee} totalAmount={totalAmount}
                    subtotal={subtotal} total={total} discountAmount={discountAmount} discount={discount} type={type} />

                {/* Application Info */}
                <ApplicationInfo personalInfo={personalInfo} visaData={visaData} visaSpecification={visaSpecification} cartItems={cartItems} discount={discount} type={type} />

                {/* Trust Badges - Only show on desktop */}
                <div className="hidden lg:block">
                    <TrustBadges />
                </div>
            </div>
        </>
    )
}

export default PaymentSummaryCard