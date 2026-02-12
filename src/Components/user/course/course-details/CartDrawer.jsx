import React from 'react'
import { CheckCircle, ShoppingCart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeCartItem } from '../../../../Redux/Slice/cartSlice';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import hotToast from '../../../../util/alert/hot-toast';

const CartDrawer = ({ cartItems, cartId, setCartDrawer }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const removeFromCart = (cid) => {

        dispatch(removeCartItem({ cartId, courseId: cid }))
            .then(res => {
                // console.log('Response for removing items from cart',res);
                hotToast(`Course removed from cart`, "success");
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    };

    const calculateTotal = () => cartItems?.reduce((s, i) => s + parseInt(i?.courses?.pricing), 0);

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setCartDrawer(false)} />

            <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 flex flex-col border-l border-white/20">
                <div className="bg-gradient-to-r from-[#FF5252] to-[#E63946] px-6 py-5 flex items-center justify-between text-white">
                    <div>
                        <h2 className="text-2xl font-bold">Shopping Cart</h2>
                        <p className="text-white/90 text-sm mt-1">{cartItems?.length} {cartItems?.length === 1 ? 'item' : 'items'}</p>
                    </div>
                    <button onClick={() => setCartDrawer(false)} className="hover:bg-white/20 rounded-full p-2 transition-colors cursor-pointer">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {cartItems?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingCart className="w-20 h-20 text-gray-300 mb-4" />
                            <p className="text-gray-600 text-lg">Your cart is empty</p>
                            <p className="text-gray-400 text-sm mt-2">Add courses to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems?.map(item => (
                                <div key={item?.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-[#FF5252] transition-all shadow-sm">
                                    <div className="flex gap-4">
                                        <img src={item?.courses?.img_url} alt={item?.courses?.course_name} className="w-24 h-24 object-cover rounded-lg" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item?.courses?.course_name}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{item?.courses?.skill_level} • {item?.courses?.course_content?.[0]?.documents?.length + 1} lectures</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-bold text-[#FF5252]">₹{parseInt(item?.courses?.pricing).toLocaleString('en-IN')}</span>
                                                <button onClick={() => removeFromCart(item?.courses?.id)} className="text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cartItems?.length > 0 && (
                    <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm px-6 py-5">
                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                            <span className="text-gray-700 font-medium">Subtotal ({cartItems?.length} {cartItems?.length === 1 ? 'item' : 'items'}):</span>
                            <span className="text-xl font-bold text-gray-900">₹{calculateTotal().toLocaleString('en-IN')}</span>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center justify-between text-lg font-bold mb-1">
                                <span className="text-gray-900">Total:</span>
                                <span className="text-[#FF5252] text-2xl">₹{calculateTotal().toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <button onClick={() => navigate('/cart')} className="w-full bg-gradient-to-r from-[#FF5252] to-[#E63946] hover:from-[#E63946] hover:to-[#FF5252] text-white font-semibold py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mb-3 transform hover:scale-105 cursor-pointer">
                            Go to Cart<ShoppingCart className="w-5 h-5" />
                        </button>

                        <button onClick={() => setCartDrawer(false)} className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:border-[#FF5252] hover:text-[#FF5252] transition-all cursor-pointer">
                            Continue Shopping
                        </button>

                        <div className="flex items-center justify-center gap-2 text-green-600 text-sm mt-4">
                            <CheckCircle className="w-4 h-4" /><span>Secure checkout</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartDrawer