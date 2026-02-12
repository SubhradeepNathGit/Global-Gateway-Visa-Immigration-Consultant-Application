import React from 'react'
import { CheckCircle, ShoppingCart } from 'lucide-react'

const CartHeader = ({ cartItems, total }) => {
    
    return (
        <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                        <ShoppingCart className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                            Shopping Cart
                        </h1>
                        <p className="mt-2 text-white/70 text-sm">Secure Checkout</p>
                    </div>
                </div>
                <p className="text-white/80 text-base sm:text-lg mt-4">
                    {cartItems?.length} {cartItems?.length === 1 ? 'course' : 'courses'} selected • Ready to proceed
                </p>
            </div>

            {cartItems?.length > 0 && (
                <div className="hidden lg:flex items-center justify-end gap-6">
                    <div className="text-right">
                        <p className="text-white/60 text-sm mb-1">Total Amount</p>
                        <p className="text-4xl font-bold">₹{total?.toLocaleString('en-IN')}</p>
                        <p className="text-white/70 text-xs mt-1">Inclusive of all taxes</p>
                    </div>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                </div>
            )}
        </div>
    )
}

export default CartHeader