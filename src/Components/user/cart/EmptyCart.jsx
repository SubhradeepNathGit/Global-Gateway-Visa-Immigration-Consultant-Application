import React from 'react'
import { ShoppingCart, Sparkles, Globe, FileCheck, Users, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyCart = ({ navigateBack }) => {

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 sm:p-16 text-center border border-slate-200"
        >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <ShoppingCart className="w-16 h-16 text-slate-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                Your cart is empty
            </h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
                Start your visa journey by exploring our expert consultation services and preparation courses.
            </p>

            {/* Popular Services Suggestions */}
            <div className="max-w-2xl mx-auto mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Popular Services</h3>
                <div className="grid sm:grid-cols-3 gap-4 text-left">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <Globe className="w-8 h-8 text-[#FF5252] mb-2" />
                        <h4 className="font-semibold text-sm mb-1">Study Visa</h4>
                        <p className="text-xs text-slate-600">Complete guidance</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <FileCheck className="w-8 h-8 text-[#FF5252] mb-2" />
                        <h4 className="font-semibold text-sm mb-1">IELTS Prep</h4>
                        <p className="text-xs text-slate-600">Band 7+ guaranteed</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <Users className="w-8 h-8 text-[#FF5252] mb-2" />
                        <h4 className="font-semibold text-sm mb-1">Work Permit</h4>
                        <p className="text-xs text-slate-600">Expert assistance</p>
                    </div>
                </div>
            </div>

            <button
                onClick={()=>navigateBack()}
                className="bg-gradient-to-r from-[#FF5252] to-[#E63946] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all transform hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
            >
                <Sparkles className="w-5 h-5" />
                Explore Our Services
            </button>

            {/* Support Contact */}
            <div className="mt-8 pt-8 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-3">Need help choosing the right service?</p>
                <p className="text-[#FF5252] font-semibold text-sm inline-flex items-center gap-2">
                    <Headphones className="w-4 h-4" />
                    Use our live chat in the bottom-right corner
                </p>
            </div>
        </motion.div>
    )
}

export default EmptyCart