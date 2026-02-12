import React, { useState } from 'react'
import { ArrowRight, Tag, CheckCircle, Package, X, CreditCard, Lock, Info, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import hotToast from '../../../util/alert/hot-toast';
import getSweetAlert from '../../../util/alert/sweetAlert';
import { useNavigate } from 'react-router-dom';

const PaymentSummaryCard = ({ cartId, cartItems, userAuthData, allCharges, promoCodes, subtotal, tax, total, discountAmount, discount, setDiscount }) => {

    const [promoCode, setPromoCode] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [promoApplied, setPromoApplied] = useState(false);
    const navigate = useNavigate();

    const handleApplyPromo = () => {
        let isPromocodeAdded = false;
        const code = promoCode.toUpperCase();

        const isAvailable = promoCodes?.some(p => p?.name == code);
        if (!isAvailable) {
            hotToast('Oops! Invalid promocode.', 'info', <Info className='text-orange-600' />);
            return;
        }

        promoCodes?.forEach(promo => {
            if (promo?.name == code && promo?.apply_mode == 'first_time' && !userAuthData?.has_purchase_course) {
                setDiscount(promo?.discount_amount);
                setPromoApplied(true);
                isPromocodeAdded = true;
                hotToast('Congrates! Promocode added.', 'success');
                return;
            }
            if (promo?.name == code && promo?.apply_mode == 'always') {
                setDiscount(promo?.discount_amount);
                setPromoApplied(true);
                isPromocodeAdded = true;
                hotToast('Congrates! Promocode added.', 'success');
                return;
            }
        })

        if (!isPromocodeAdded) {
            hotToast('Oops! Promocode not applicable.', 'error');
        }
    };

    const handleRemovePromo = () => {
        setPromoCode('');
        setDiscount(0);
        setPromoApplied(false);
    };

    const handleProceedToBuy = () => {
        if (!agreeTerms) {
            getSweetAlert('oops!', 'Please agree to the Terms & Conditions and Refund Policy to continue.', 'warning');
            return;
        }

        const hasInactiveCourse = cartItems?.some(
            (item) => item?.courses?.status !== "active"
        );

        if (hasInactiveCourse) {
            hotToast("All cart items not available right now. Please check", 'info', <Info className='text-orange-600' />);
            return;
        }

        navigate("/payment", {
            state: { cartId, subtotal, total, discountAmount, discount, allCharges, userAuthData, cartItems }
        });

    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF5252] to-[#E63946] flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Order Summary
                    </h2>
                    <p className="text-xs text-slate-600">Review your purchase</p>
                </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-700">
                    <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {promoApplied && (
                    <div className="flex justify-between text-green-600 bg-green-50 -mx-2 px-2 py-2 rounded-lg">
                        <span className="flex items-center gap-2 font-medium">
                            <Tag className="w-4 h-4" />
                            Discount ({discount}%)
                        </span>
                        <span className="font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                )}
                {allCharges?.map(charge => (
                    <div key={charge?.id} className="flex justify-between text-slate-700">
                        <span className="flex items-center gap-1">
                            {charge?.charge_type} ({charge?.percentage}%)
                            <Info className="w-3 h-3 text-slate-400" />
                        </span>
                        <span className="font-semibold">₹{Math?.round((subtotal - discountAmount) * (Number.parseInt(charge?.percentage)) / 100).toLocaleString('en-IN')}</span>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 -mx-6 px-6 py-5 mb-6 border-y border-slate-200">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-slate-600 mb-1">Total Amount</p>
                        <p className="text-3xl font-bold text-slate-900">
                            ₹{total.toLocaleString('en-IN')}
                        </p>
                    </div>
                    {promoApplied && (
                        <div className="text-right">
                            <p className="text-xs text-green-600 font-semibold bg-green-100 px-3 py-1.5 rounded-full">
                                Saved ₹{discountAmount.toLocaleString('en-IN')}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Terms Agreement */}
            <div className="mb-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 text-[#FF5252] border-slate-300 rounded focus:ring-[#FF5252]"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                        I agree to the{' '}
                        <a href="#" className="text-[#FF5252] font-semibold hover:underline">Terms & Conditions</a>
                        {' '}and{' '}
                        <a href="#" className="text-[#FF5252] font-semibold hover:underline">Refund Policy</a>
                    </span>
                </label>
            </div>

            {/* Checkout Button */}
            <motion.button
                whileHover={{ scale: agreeTerms ? 1.02 : 1 }}
                whileTap={{ scale: agreeTerms ? 0.98 : 1 }}
                onClick={handleProceedToBuy}
                disabled={!agreeTerms}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-base mb-4 ${agreeTerms
                    ? 'bg-gradient-to-r from-[#FF5252] to-[#E63946] text-white hover:shadow-xl cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
            >
                <Lock className="w-5 h-5" />
                Buy Now - ₹{total.toLocaleString('en-IN')}
                <ArrowRight className="w-5 h-5" />
            </motion.button>

            {/* Payment Methods */}
            <div className="mb-4">
                <p className="text-xs text-slate-600 font-semibold mb-2">Accepted Payment Methods</p>
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-700">
                        <CreditCard className="w-3 h-3 inline mr-1" />Cards
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-700">
                        <Smartphone className="w-3 h-3 inline mr-1" />UPI
                    </div>
                </div>
            </div>

            {/* Promo Code */}
            <div className="pt-4 border-t border-slate-200">
                <label className="block text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#FF5252]" />
                    Have a promo code?
                </label>
                {!promoApplied ? (
                    <div className="flex gap-2">
                        <input
                            type="text" value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            placeholder="Enter code"
                            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5252] focus:border-transparent text-sm uppercase"
                        />
                        <button
                            onClick={handleApplyPromo} disabled={!promoCode.trim()}
                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer
                            ${promoCode.trim() ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-400 text-white cursor-not-allowed"}`}>
                            Apply
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between bg-green-50 border border-green-300 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-bold text-green-800">
                                {promoCode} Applied!
                            </span>
                        </div>
                        <button
                            onClick={handleRemovePromo}
                            className="text-green-700 hover:text-green-900 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <p className="text-xs text-slate-500 mt-2">
                    Try: {
                        promoCodes?.map((code, index) => (
                            <span key={index}>{code?.name}{promoCodes?.length > index + 1 ? ',' : ''} </span>
                        ))
                    }
                </p>
            </div>
        </div>
    )
}

export default PaymentSummaryCard