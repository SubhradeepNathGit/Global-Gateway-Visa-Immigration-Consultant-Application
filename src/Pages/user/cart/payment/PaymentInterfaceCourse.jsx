import React, { useEffect } from "react";
import CourseOrderSummary from "../../../../Components/user/cart/payment/CourseOrderSummary";
import PaymentForm from "../../../../Components/user/common/payment/PaymentForm";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentInterfaceCourse() {

  const navigate = useNavigate();
  const { state } = useLocation();
  const type = "course";

  useEffect(() => {
    if (!state) {
      navigate("/cart", { replace: true });
    }
  }, [state, navigate]);

  if (!state) {
    return null;
  }

  const { cartId, subtotal, total, discountAmount, discount, allCharges, userAuthData, cartItems } = state;

  return (
    <div className="min-h-screen w-screen bg-white lg:h-screen lg:overflow-hidden">
      <div className="flex flex-col lg:h-full lg:grid lg:grid-cols-2">

        {/* Left Panel - Order Summary */}
        <CourseOrderSummary subtotal={subtotal} total={total} discountAmount={discountAmount} discount={discount} allCharges={allCharges} cartItems={cartItems} />

        {/* Right Panel - Payment Form */}
        <PaymentForm type={type} cartId={cartId} subtotal={subtotal} total={total} discountAmount={discountAmount} discount={discount} allCharges={allCharges} userAuthData={userAuthData} cartItems={cartItems} />

      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}