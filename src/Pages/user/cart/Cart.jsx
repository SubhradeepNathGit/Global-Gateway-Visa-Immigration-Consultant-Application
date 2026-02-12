import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import CartHeader from '../../../Components/user/cart/CartHeader';
import EmptyCart from '../../../Components/user/cart/EmptyCart';
import CartHeaderWithAction from '../../../Components/user/cart/CartHeaderWithAction';
import CartItemCard from '../../../Components/user/cart/CartItemCard';
import ImportantNotes from '../../../Components/user/cart/ImportantNotes';
import PaymentSummaryCard from '../../../Components/user/cart/PaymentSummaryCard';
import SecurityTrust from '../../../Components/user/cart/SecurityTrust';
import TrustBadage from '../../../Components/user/cart/TrustBadage';
import SupportCard from '../../../Components/user/cart/SupportCard';
import SupportModal from '../../../Components/user/cart/SupportModal';
import { useDispatch, useSelector } from 'react-redux';
import { checkLoggedInUser } from '../../../Redux/Slice/auth/checkAuthSlice';
import getSweetAlert from '../../../util/alert/sweetAlert';
import { fetchCartItems, getOrCreateCart } from '../../../Redux/Slice/cartSlice';
import { fetchCharges } from '../../../Redux/Slice/chargesSlice';
import { fetchCodes } from '../../../Redux/Slice/promocodeSlice';
import { useNavigate } from 'react-router-dom';


const Cart = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [discount, setDiscount] = useState(0);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const { isuserLoading, userAuthData, userError } = useSelector(state => state.checkAuth);
  const { isCartLoading, cartItems, currentCart, hasCartError } = useSelector(state => state.cart);
  const { isChargesLoading, allCharges, hasChargesError } = useSelector(state => state?.charge);
  const { isCodeLoading, allCode: promoCodes, hasCodesError } = useSelector(state => state?.promocode);

  // Calculate totals
  let tax = 0;
  const subtotal = cartItems?.reduce((sum, item) => sum + parseInt(item?.courses?.pricing), 0);
  const discountAmount = Math.round(subtotal * (discount / 100));
  allCharges?.course?.forEach(charge => {
    tax += Math?.round((subtotal - discountAmount) * (Number.parseInt(charge?.percentage)) / 100);
  })
  const total = subtotal - discountAmount + tax;

  const navigateBack = () => {
    navigate('/course');
  };

  useEffect(() => {
    dispatch(checkLoggedInUser())
      .then(res => {
        // console.log('Response for fetching user profile', res);
      })
      .catch((err) => {
        console.log("Error occurred", err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      });
  }, [dispatch]);

  useEffect(() => {
    dispatch(getOrCreateCart(userAuthData?.id))
      .then(res => {
        // console.log('Response for getting cart details for specific user', res);

        dispatch(fetchCartItems(res?.payload?.id))
          .then(res => {
            // console.log('Response for fetching cart items', res);
          })
          .catch(err => {
            console.log('Error occured', err);
            getSweetAlert('Oops...', 'Something went wrong!', 'error');
          })
      })
      .catch(err => {
        console.log(err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }, [userAuthData?.id, dispatch]);

  useEffect(() => {
    dispatch(fetchCharges({ type: 'course', status: true }))
      .then(res => {
        // console.log('Response for fetching all charges for course', res);
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }, []);

  useEffect(() => {
    dispatch(fetchCodes({ status: true }))
      .then(res => {
        // console.log('Response for fetching all codes', res);
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }, []);

  // console.log('Available cart items', cartItems);
  // console.log('Available promocode', promoCodes);
  // console.log('Available charges', allCharges?.course);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Professional Header with Trust Indicators */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white shadow-2xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 sm:py-12">
          <button
            onClick={() => navigateBack()}
            className="flex items-center text-white/80 hover:text-white mb-6 transition-colors font-medium text-sm group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </button>

          <CartHeader cartItems={cartItems} total={total} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl">
        {(isCartLoading || isChargesLoading || isCodeLoading) ? (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF5252] mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Loading course details...</p>
            </div>
          </div>
        ) : cartItems?.length === 0 ? (
          // Empty Cart - Professional
          <EmptyCart navigateBack={navigateBack} />
        ) : (
          // Cart with Items - Production Ready
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header with Actions */}
              <CartHeaderWithAction cartItems={cartItems} cartId={currentCart?.id} />

              {/* Cart Items */}
              <AnimatePresence mode="popLayout">
                {cartItems?.map((item, index) => (
                  <CartItemCard key={item.id} item={item} index={index} cartId={currentCart?.id} />
                ))}
              </AnimatePresence>

              {/* Important Notes */}
              <ImportantNotes />
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-5">
                {/* Main Summary Card */}
                <PaymentSummaryCard cartId={currentCart?.id} cartItems={cartItems} userAuthData={userAuthData} allCharges={allCharges?.course} promoCodes={promoCodes} subtotal={subtotal} tax={tax} total={total} discountAmount={discountAmount} discount={discount} setDiscount={setDiscount} />

                {/* Security & Trust */}
                <SecurityTrust />

                {/* Support Card */}
                <SupportCard setShowSupportModal={setShowSupportModal} />

                {/* Trust Badge */}
                <TrustBadage />

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Support Modal */}
      {showSupportModal && (
        <SupportModal setShowSupportModal={setShowSupportModal} />
      )}

      <style>{`
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  );
};

export default Cart;