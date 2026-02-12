import React, { useState } from 'react'
import { HandCoins, FileText, ChevronDown, ChevronUp, Wallet } from "lucide-react";
import ApplicationDetails from './dropdown-list/ApplicationDetails';
import PaymentMethod from './dropdown-list/PaymentMethod';
import FeeBreakDown from './dropdown-list/FeeBreakDown';
import CourseDetails from './dropdown-list/CourseDetails';

const PaymentReviewDropdown = ({ personalInfo, paymentMethod, visaData, visaSpecification, applicationFee, serviceFee, totalAmount,
    subtotal, total, discountAmount, discount, cartItems, type }) => {

    const [expandedSection, setExpandedSection] = useState("application");

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const CollapsibleSection = ({ id, title, icon: Icon, children, count, type }) => (
        <div className="bg-white rounded-xl border border-gray-300 overflow-hidden transition-all duration-200 hover:border-gray-400">
            <button
                onClick={() => toggleSection(id)}
                className="w-full px-4 sm:px-5 md:px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-900/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={20} className="text-cyan-700" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-gray-900 text-sm md:text-base">{title ?? 'N/A'}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{count ?? 'N/A'} {type && type != 'visa' ? count > 1 ? 'courses' : 'course' : count > 1 ? 'fields' : 'field'}</p>
                    </div>
                </div>
                {expandedSection === id ? (
                    <ChevronUp className="text-gray-400 flex-shrink-0" size={20} />
                ) : (
                    <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                )}
            </button>

            {expandedSection === id && (
                <div className="px-4 sm:px-5 md:px-6 py-4 border-t border-gray-300">
                    {children}
                </div>
            )}
        </div>
    );

    const InfoRow = ({ icon: Icon, label, value, mono = false }) => (
        <div className="flex items-start gap-3 py-2.5">
            <Icon size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className={`text-sm font-medium text-gray-900 break-words ${mono ? 'font-mono' : ''}`}>
                    {value || "—"}
                </p>
            </div>
        </div>
    );

    return (
        <>
            {/* Application Details */}
            < CollapsibleSection id="application"
                title={`${type == 'visa' ? 'Application ' : 'Course '}Information`}
                icon={FileText} count={type != 'visa' ? cartItems?.length : '3'} type={type}>
                {type == 'visa' ?
                    <ApplicationDetails personalInfo={personalInfo} InfoRow={InfoRow} visaData={visaData} visaSpecification={visaSpecification} />
                    : <CourseDetails InfoRow={InfoRow} cartItems={cartItems} />
                }
            </CollapsibleSection >

            {/* Payment Method Details */}
            < CollapsibleSection id="payment"
                title="Payment Method" icon={Wallet}
                count={paymentMethod?.payment_method === "card" ? 4 : 1}>
                <PaymentMethod paymentMethod={paymentMethod} InfoRow={InfoRow} />
            </CollapsibleSection >

            {/* Fee Breakdown */}
            < CollapsibleSection id="fees"
                title="Payment Breakdown"
                icon={HandCoins} count={serviceFee.length + 1 + (Number(discount) > 0 ? 1 : 0)}>
                <FeeBreakDown applicationFee={applicationFee} serviceFee={serviceFee} totalAmount={totalAmount} discountAmount={discountAmount} discount={discount} type={type}
                    subtotal={subtotal} total={total} />
            </CollapsibleSection >
        </>
    )
}

export default PaymentReviewDropdown