import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactInfo = () => {
    return (
        <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-100 transition-all duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-0 lg:divide-x lg:divide-gray-100">
                {/* Phone Contact */}
                <div className="flex items-center gap-6 group lg:px-10 xl:px-12 lg:first:pl-0">
                    <div className="w-16 h-16 rounded-2xl bg-[#FAFAFA] border border-gray-50 flex items-center justify-center group-hover:bg-[#e53935] group-hover:scale-110 transition-all duration-500 shadow-sm shrink-0">
                        <Phone className="w-6 h-6 text-[#6c757d]/60 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#6c757d] uppercase tracking-[0.2em] mb-1.5 opacity-60">Call Anytime</p>
                        <p className="text-[15px] lg:text-[17px] font-bold text-[#2c3e50] tracking-tight whitespace-nowrap">+91-80001-23456</p>
                    </div>
                </div>

                {/* Email Contact */}
                <div className="flex items-center gap-6 group lg:px-10 xl:px-12">
                    <div className="w-16 h-16 rounded-2xl bg-[#FAFAFA] border border-gray-50 flex items-center justify-center group-hover:bg-[#e53935] group-hover:scale-110 transition-all duration-500 shadow-sm shrink-0">
                        <Mail className="w-6 h-6 text-[#6c757d]/60 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#6c757d] uppercase tracking-[0.2em] mb-1.5 opacity-60">Email Us</p>
                        <p className="text-[15px] lg:text-[17px] font-bold text-[#2c3e50] tracking-tight truncate">info@globalgateway.com</p>
                    </div>
                </div>

                {/* Office Contact */}
                <div className="flex items-center gap-6 group lg:px-10 xl:px-12 lg:last:pr-0">
                    <div className="w-16 h-16 rounded-2xl bg-[#FAFAFA] border border-gray-100 flex items-center justify-center group-hover:bg-[#e53935] group-hover:scale-110 transition-all duration-500 shadow-sm shrink-0">
                        <MapPin className="w-6 h-6 text-[#6c757d]/60 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#6c757d] uppercase tracking-[0.2em] mb-1.5 opacity-60">Visit Us</p>
                        <p className="text-[15px] lg:text-[17px] font-bold text-[#2c3e50] tracking-tight">New Delhi, India</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;