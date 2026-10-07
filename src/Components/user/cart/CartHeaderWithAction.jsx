import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteCart } from '../../../Redux/Slice/cartSlice';
import hotToast from '../../../util/alert/hot-toast';
import getSweetAlert from '../../../util/alert/sweetAlert';

const CartHeaderWithAction = ({ cartItems, cartId }) => {
    const dispatch = useDispatch();
    const { currentCart } = useSelector(state => state.cart);
    const effectiveCartId = cartId || currentCart?.id || cartItems?.[0]?.cart_id;

    const handleClearCart = () => {
        if (!effectiveCartId) {
            getSweetAlert('Oops...', 'Cart ID not found', 'error');
            return;
        }

        dispatch(deleteCart(effectiveCartId))
            .then(res => {
                if (res.meta.requestStatus === "fulfilled") {
                    hotToast(`All courses removed from cart`, "success");
                } else {
                    console.error('Failed to clear cart:', res);
                    getSweetAlert('Oops...', res.payload || 'Failed to remove courses from cart', 'error');
                }
            })
            .catch(err => {
                console.log('Error occurred', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Your Selected Services
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                        {cartItems?.length} {cartItems?.length === 1 ? 'item' : 'items'} • Review before checkout
                    </p>
                </div>
                {cartItems.length > 1 && (
                    <button
                        onClick={handleClearCart}
                        className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-red-50 cursor-pointer"
                    >
                        Clear All
                    </button>
                )}
            </div>
        </div>
    )
}

export default CartHeaderWithAction