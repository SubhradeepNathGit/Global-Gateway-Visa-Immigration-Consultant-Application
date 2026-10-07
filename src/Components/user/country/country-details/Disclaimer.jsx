import React from 'react';
import { AlertCircle } from 'lucide-react';

const Disclaimer = () => {
    return (
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-gray-100 transition-all duration-300">
            <div className="flex items-start gap-4 sm:gap-5">
                <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <AlertCircle className="w-5 h-5 text-[#e53935]" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#6c757d] uppercase tracking-[0.2em] mb-1.5">
                        Important Immigration Notice
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed font-normal">
                        Visa requirements and immigration regulations are subject to change without notice. We strongly recommend consulting with our certified visa specialists for the most current and accurate information pertaining to your specific situation.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Disclaimer;