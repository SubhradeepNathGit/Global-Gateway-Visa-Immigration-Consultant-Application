import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShoppingBag, 
    X, 
    Trash2, 
    ArrowRight, 
    Lock, 
    ShieldCheck, 
    Award, 
    GraduationCap, 
    Video, 
    Sparkles, 
    Clock, 
    Globe2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeCartItem } from '../../../../Redux/Slice/cartSlice';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import hotToast from '../../../../util/alert/hot-toast';

const CartDrawer = ({ cartItems, cartId, setCartDrawer }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentCart } = useSelector(state => state.cart);
    const effectiveCartId = cartId || currentCart?.id || cartItems?.[0]?.cart_id;

    const removeFromCart = (cid) => {
        dispatch(removeCartItem({ cartId: effectiveCartId, courseId: cid }))
            .then(res => {
                if (res.meta.requestStatus === "fulfilled") {
                    hotToast(`Course removed from cart`, "success");
                } else {
                    getSweetAlert('Oops...', 'Failed to remove course', 'error');
                }
            })
            .catch(err => {
                console.log('Error occurred', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
    };

    const calculateTotal = () => cartItems?.reduce((s, i) => s + parseInt(i?.courses?.pricing || 0), 0) || 0;
    const itemCount = cartItems?.length || 0;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden font-['Inter']">
            {/* Ambient Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm cursor-pointer"
                onClick={() => setCartDrawer(false)}
            />

            {/* Sliding Drawer Panel */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed right-0 top-0 bottom-0 h-full w-full sm:w-[480px] md:w-[500px] bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.18)] flex flex-col border-l border-slate-100 z-50 select-none"
            >
                {/* Header */}
                <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/70 border border-red-200/60 flex items-center justify-center text-[#FF5252] shadow-xs">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-slate-900 font-['Outfit'] tracking-tight">
                                    Shopping Cart
                                </h2>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-[#FF5252] border border-red-100/90">
                                    {itemCount} {itemCount === 1 ? 'Program' : 'Programs'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                                <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                                <span>Global Gateway Learning Academy</span>
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setCartDrawer(false)}
                        className="w-9 h-9 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 transition-all flex items-center justify-center cursor-pointer hover:rotate-90 duration-200"
                        aria-label="Close cart drawer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* International Quality Strip (Only when items exist) */}
                {itemCount > 0 && (
                    <div className="px-6 pt-3.5 pb-1 flex-shrink-0">
                        <div className="p-2.5 bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-emerald-50/90 border border-emerald-100/80 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 shadow-xs">
                            <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-700">
                                <ShieldCheck className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 text-[11px] leading-tight">
                                <span className="font-semibold text-emerald-900">Accredited Preparation:</span> Lifetime module access & verified completion credentials.
                            </div>
                        </div>
                    </div>
                )}

                {/* Scrollable Items Container with Invisible Scrollbar */}
                <div
                    className="flex-1 overflow-y-auto px-6 py-3.5 space-y-3.5 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {itemCount === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
                            <div className="relative mb-5">
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-red-50 via-slate-50 to-amber-50 border border-slate-200/80 flex items-center justify-center shadow-inner">
                                    <ShoppingBag className="w-9 h-9 text-slate-300" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FF5252] text-white flex items-center justify-center shadow-md animate-pulse">
                                    <Sparkles className="w-3 h-3" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] mb-1.5">
                                Your Cart is Empty
                            </h3>
                            <p className="text-sm text-slate-500 max-w-xs mb-6 leading-relaxed">
                                Explore accredited visa coaching, IELTS/PTE preparation, and language skill modules.
                            </p>
                            <button
                                onClick={() => {
                                    setCartDrawer(false);
                                    navigate('/course');
                                }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg cursor-pointer group"
                            >
                                <span>Browse Programs</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {cartItems?.map((item, index) => {
                                const lectureCount = (item?.courses?.course_content?.[0]?.documents?.length || 0) + 1;
                                return (
                                    <motion.div
                                        key={item?.id || item?.courses?.id || index}
                                        layout
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                        className="group relative bg-white rounded-2xl border border-slate-200/80 p-3.5 hover:border-slate-300 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex gap-3.5">
                                            {/* Thumbnail */}
                                            <div className="relative w-22 h-22 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-100 shadow-xs">
                                                <img
                                                    src={item?.courses?.img_url}
                                                    alt={item?.courses?.course_name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <span className="absolute bottom-1.5 left-1.5 bg-slate-900/75 backdrop-blur-xs text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-md">
                                                    {item?.courses?.course_name?.split(" ")[0]}
                                                </span>
                                            </div>

                                            {/* Course Details */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-[#FF5252] transition-colors">
                                                            {item?.courses?.course_name}
                                                        </h3>
                                                        <button
                                                            onClick={() => removeFromCart(item?.courses?.id)}
                                                            className="w-7 h-7 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 -mr-1 -mt-1"
                                                            title="Remove course from cart"
                                                            aria-label="Remove item"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>

                                                    {/* Metadata Tags */}
                                                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                                            <GraduationCap className="w-3 h-3 text-slate-500" />
                                                            {item?.courses?.skill_level || 'Beginner'}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                                                            <Video className="w-3 h-3 text-slate-400" />
                                                            {lectureCount} {lectureCount === 1 ? 'lecture' : 'lectures'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Price Row */}
                                                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100">
                                                    <span className="text-[11px] text-slate-400 font-medium">Standard Tuition</span>
                                                    <span className="text-base font-bold text-slate-900">
                                                        ₹{parseInt(item?.courses?.pricing || 0).toLocaleString('en-IN')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>

                {/* Footer Section (Summary & Actions) */}
                {itemCount > 0 && (
                    <div className="border-t border-slate-100 bg-white/95 backdrop-blur-md px-6 py-5 flex-shrink-0 shadow-[0_-12px_30px_rgba(0,0,0,0.04)]">
                        {/* Financial Breakdown */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                                <span>Subtotal ({itemCount} {itemCount === 1 ? 'course' : 'courses'})</span>
                                <span className="text-slate-800 font-semibold">₹{calculateTotal().toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                                <span>Enrollment & Certification Fee</span>
                                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                    Waived
                                </span>
                            </div>
                            <div className="h-px bg-slate-100 my-2" />
                            <div className="flex items-baseline justify-between">
                                <div>
                                    <span className="text-sm font-bold text-slate-900 font-['Outfit']">Total Investment</span>
                                    <p className="text-[10px] text-slate-400">All taxes & fees included</p>
                                </div>
                                <span className="text-2xl font-extrabold text-[#FF5252] font-['Outfit'] tracking-tight">
                                    ₹{calculateTotal().toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="space-y-2.5">
                            <button
                                onClick={() => {
                                    setCartDrawer(false);
                                    navigate('/cart');
                                }}
                                className="w-full bg-gradient-to-r from-[#FF5252] to-[#E63946] hover:from-[#E63946] hover:to-[#FF5252] text-white font-semibold py-3.5 px-5 rounded-xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/35 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group transform hover:-translate-y-0.5"
                            >
                                <span>Go to Cart</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => setCartDrawer(false)}
                                className="w-full py-2.5 px-4 rounded-xl border border-slate-200/90 hover:border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                Continue Browsing Programs
                            </button>
                        </div>

                        {/* Security & Global Standards */}
                        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                                <span>256-Bit SSL</span>
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="flex items-center gap-1.5">
                                <Award className="w-3.5 h-3.5 text-amber-500" />
                                <span>Global Credential</span>
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                <span>Instant Access</span>
                            </span>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default CartDrawer;