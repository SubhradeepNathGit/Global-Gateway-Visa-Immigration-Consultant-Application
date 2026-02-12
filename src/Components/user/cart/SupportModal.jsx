import React from 'react'
import { X, Phone, Mail, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SupportModal = ({setShowSupportModal}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Contact Support</h3>
                    <button
                        onClick={() => setShowSupportModal(false)}
                        className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                                <Phone className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900">Call Us</p>
                                <p className="text-sm text-slate-600">Mon-Sat, 9 AM - 7 PM</p>
                            </div>
                        </div>
                        <a href="tel:+911800000000" className="text-[#FF5252] font-bold text-lg hover:underline">
                            +91 1800-000-000
                        </a>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900">Email Us</p>
                                <p className="text-sm text-slate-600">24/7 Support</p>
                            </div>
                        </div>
                        <a href="mailto:support@visaexpert.com" className="text-[#FF5252] font-semibold hover:underline">
                            support@visaexpert.com
                        </a>
                    </div>

                    <div className="bg-gradient-to-r from-[#FF5252] to-[#E63946] rounded-xl p-4 text-white">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold">Live Chat</p>
                                <p className="text-sm text-white/90">Instant responses</p>
                            </div>
                        </div>
                        <p className="text-sm text-white/90">
                            Use the chat icon in the bottom-right corner to start a conversation with our support team.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default SupportModal