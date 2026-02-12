import React from "react";
import { ArrowLeft, CheckCircle, Lock, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const CourseOrderSummary = ({ subtotal, total, discountAmount, discount, allCharges, cartItems }) => {

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 lg:p-12 flex flex-col lg:overflow-hidden">
            <Link to="/cart"
                className=" flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8 group w-fit cursor-pointer" >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Cart</span>
            </Link>

            <div className="mb-3 -mt-7">
                <div className="flex items-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                        <img
                            src="/payment/paypal-logo.png"
                            className="w-16 h-16 md:w-20 md:h-20 object-contain -ml-10"
                        />
                    </div>

                    <div className="-ml-10">
                        <p className="text-sm text-gray-400">Secure Payment by </p>
                        <h3 className="text-lg font-bold italic ">PayPal</h3>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 shadow-xl backdrop-blur-sm">
                {/* <div className="flex flex-col items-start justify-between mb-6"> */}
                <div className="mb-6 space-y-4 h-[60px] overflow-y-auto glass-scrollbar">
                    {cartItems?.map(item => (
                        <div
                            key={item?.id} className="flex items-start justify-between gap-4">
                            {/* Left side */}
                            <div>
                                <h2 className="text-xl font-semibold mb-2">
                                    {item?.courses?.course_name ?? 'N/A'}
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    Language: {item?.courses?.language ?? 'N/A'}
                                </p>
                            </div>

                            {/* Right side */}
                            <div className="bg-green-500/20 text-green-400 w-24 text-center py-1 rounded-full text-xs font-bold border border-green-500/30 whitespace-nowrap">
                                {item?.courses?.skill_level ?? 'N/A'}
                            </div>
                        </div>
                    ))}
                </div>


                <div className="space-y-3 mb-6 pb-6 border-b border-gray-700/50">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <CheckCircle size={16} className="text-green-400 flex-shrink-0" strokeWidth={2.5} />
                        <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <CheckCircle size={16} className="text-green-400 flex-shrink-0" strokeWidth={2.5} />
                        <span>Lifetime access</span>
                    </div>

                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Course Fee</span>
                        <span className="font-semibold">₹{Number(subtotal)?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? 'N/A'}</span>
                    </div>
                    {Number(discount) > 0 && (
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-gray-400 text-sm">
                                Discount ({discount}%)
                            </span>
                            <span className="font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                        </div>
                    )}
                    {
                        allCharges?.map(charge => (
                            <div className="flex justify-between items-center" key={charge?.id}>
                                <span className="flex items-center gap-1 text-gray-400 text-sm">
                                    {charge?.charge_type} ({charge?.percentage}%)
                                </span>
                                <span className="font-semibold">₹{Math?.round((subtotal - discountAmount) * (Number.parseInt(charge?.percentage)) / 100).toLocaleString('en-IN') ?? 'N/A'}</span>
                            </div>
                        ))
                    }
                    <div className="border-t border-gray-700 pt-4 mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total Amount</span>
                            <span className="text-3xl font-bold text-white">₹{total.toLocaleString('en-IN') ?? 'N/A'}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Amount payable now</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-xs mt-auto pt-8">
                <Lock size={14} className="flex-shrink-0" />
                <span>Payments secured with 256-bit SSL encryption</span>
            </div>
        </div>
    )
}

export default CourseOrderSummary