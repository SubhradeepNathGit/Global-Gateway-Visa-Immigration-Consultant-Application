import React from 'react'
import { ShoppingCart, Globe, FileCheck, Users, Headphones, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const EmptyCart = ({ navigateBack }) => {

    const navigate = useNavigate();

    const services = [
        {
            icon: Globe,
            title: 'Study Visa',
            description: 'Complete guidance for your study abroad journey',
            path: '/apply-visa',
        },
        {
            icon: FileCheck,
            title: 'IELTS Prep',
            description: 'Band 7+ guaranteed preparation courses',
            path: '/course',
        },
        {
            icon: Users,
            title: 'Work Permit',
            description: 'Expert assistance for work visa applications',
            path: '/apply-visa',
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="py-6"
        >
            {/* Empty State */}
            <div className="text-center mb-14">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <ShoppingCart className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Your cart is empty
                </h2>
                <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
                    Start your visa journey by exploring our expert consultation services and preparation courses.
                </p>
                <button
                    onClick={navigateBack}
                    className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-[#FF5252] hover:bg-[#E53935] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                    Browse Courses
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 mb-10" />

            {/* Popular Services */}
            <div className="max-w-3xl mx-auto">
                <h3 className="text-base font-semibold text-gray-900 mb-5 text-center">Popular Services</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                    {services.map((service) => (
                        <div
                            key={service.title}
                            onClick={() => navigate(service.path)}
                            className="group p-5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm transition-all cursor-pointer"
                        >
                            <service.icon className="w-7 h-7 text-[#FF5252] mb-3" />
                            <h4 className="font-medium text-sm text-gray-900 mb-1">{service.title}</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Support hint */}
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Need help choosing the right service?</p>
                <p className="text-[#FF5252] font-medium text-sm inline-flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5" />
                    Use our live chat in the bottom-right corner
                </p>
            </div>
        </motion.div>
    )
}

export default EmptyCart