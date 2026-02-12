import React, { useRef, useState } from "react";
import { Lock, CreditCard, Smartphone } from "lucide-react";
import UPIPayment from "./form/paymentType/UPIPayment";
import CardPayment from "./form/paymentType/CardPayment";
import { useNavigate } from "react-router-dom";
import FormHeader from "./form/FormHeader";
import FormFooter from "./form/FormFooter";

const PaymentForm = ({ type, personalInfoData, total_amount, application_id, allCharges, visaData, visaSpecification, application_fees, country_id, passportData,
    cartId, subtotal, total, discountAmount, discount, userAuthData, cartItems}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const navigate = useNavigate();
    const upiRef = useRef();
    const cardRef = useRef();

    const handlePayment = async () => {
        let valid = false;
        if (paymentMethod === "card") {
            await cardRef.current.validate();

            if (!cardRef.current.isValid()) {
                // console.log("Card form invalid");
                return;
            }

            const transactionId = cardRef.current.getTransactionId();
            // console.log("Transaction ID:", transactionId);
            // console.log("values", cardRef.current.getCardDetails());

            const details = cardRef.current.getCardDetails();
            navigate("/payment-preview", {
                state: {
                    paymentDetails: details,
                    personalInfoData: personalInfoData || userAuthData,
                    allCharges,
                    visaData: visaData || null,
                    visaSpecification: visaSpecification || null,
                    application_fees: application_fees || null,
                    country_id: country_id || null,
                    passportData: passportData || null,
                    subtotal: subtotal || null,
                    total: total || null,
                    discountAmount: discountAmount || null,
                    discount: discount || null,
                    cartItems: cartItems || null,
                    cartId: cartId || null,
                    type
                }
            });
        }
        else {
            await upiRef.current.validate();
            if (!upiRef.current.isValid()) return;

            const transactionId = upiRef.current.getTransactionId();
            // console.log("UPI Transaction ID:", transactionId);
            // console.log("values", upiRef.current.getUPIDetails());

            const details = upiRef.current.getUPIDetails();
            navigate("/payment-preview", {
                state: {
                    paymentDetails: details,
                    personalInfoData: personalInfoData || userAuthData,
                    allCharges,
                    visaData: visaData || null,
                    visaSpecification: visaSpecification || null,
                    application_fees: application_fees || null,
                    country_id: country_id || null,
                    passportData: passportData || null,
                    subtotal: subtotal || null,
                    total: total || null,
                    discountAmount: discountAmount || null,
                    discount: discount || null,
                    cartItems: cartItems || null,
                    cartId: cartId || null,
                    type
                }
            });
        }

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
    }

    return (
        <div className="p-6 lg:p-12 flex flex-col bg-white lg:overflow-y-auto glass-scrollbar">
            <div className="max-w-xl mx-auto w-full flex-1 flex flex-col">
                <div className="mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Payment Details</h1>
                    <p className="text-sm text-gray-600">Choose your payment method and complete the transaction</p>
                </div>

                <div className="flex-1 flex flex-col">
                    <FormHeader email={personalInfoData?.email || userAuthData?.email} />

                    {/* Payment Method Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Payment Method</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod("card")}
                                className={`border-2 rounded-lg px-4 py-4 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${paymentMethod === "card"
                                    ? "border-cyan-700 bg-cyan-900/10" : "border-gray-300 hover:border-gray-400 bg-white"}`}>
                                <CreditCard size={24} className={paymentMethod === "card" ? "text-cyan-700" : "text-gray-600"} />
                                <span className={`text-sm font-semibold ${paymentMethod === "card" ? "text-cyan-800" : "text-gray-700"}`}>
                                    Card
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setPaymentMethod("upi")}
                                className={`border-2 rounded-lg px-4 py-4 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${paymentMethod === "upi"
                                    ? "border-cyan-700 bg-cyan-900/10" : "border-gray-300 hover:border-gray-400 bg-white"}`}>
                                <Smartphone size={24} className={paymentMethod === "upi" ? "text-cyan-700" : "text-gray-600"} />
                                <span className={`text-sm font-semibold ${paymentMethod === "upi" ? "text-cyan-800" : "text-gray-700"}`}>
                                    UPI
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Card Payment Form */}
                    {paymentMethod === "card" && (
                        <CardPayment ref={cardRef} total_amount={type == 'visa' ? total_amount : total} />
                    )}


                    {/* UPI Payment Form */}
                    {paymentMethod === "upi" && (
                        <UPIPayment ref={upiRef} total_amount={type == 'visa' ? total_amount : total} />
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handlePayment}
                        disabled={isLoading}
                        className={`w-full bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white font-bold py-4 rounded-lg hover:from-gray-950 hover:to-black transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-x ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Processing Payment...</span>
                            </>
                        ) : (
                            <>
                                <Lock size={18} />
                                <span>Proceed to Pay</span>
                            </>
                        )}
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                        By completing this payment, you agree to our Terms of Service and authorize the charge. Your payment information is encrypted and secure.
                    </p>
                </div>

                {/* Footer */}
                <FormFooter />
            </div>
        </div>
    )
}

export default PaymentForm