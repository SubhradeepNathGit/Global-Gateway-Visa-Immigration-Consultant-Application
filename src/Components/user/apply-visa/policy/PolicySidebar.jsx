import React from 'react'
import { Phone, FileText, Shield } from 'lucide-react';
import { DownloadPolicyGuide } from '../../../../util/pdf/downloadPolicyGuide';

const PolicySidebar = ({ visaPolicyCategories, selectedCategory, setSelectedCategory, currentPolicy }) => {

    const handleDownloadPolicyGuide = () => {
        DownloadPolicyGuide(currentPolicy, selectedCategory);
    };

    // console.log('Sidebar content', visaPolicyCategories);

    return (
        <div className="w-full lg:w-80 space-y-6">
            {/* Policy Categories */}
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4">
                    Policy Categories
                </h2>
                <div className="space-y-3">
                    <button
                        onClick={() => setSelectedCategory("General Policies")}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer ${selectedCategory === "General Policies"
                            ? "bg-slate-800 text-white shadow-lg border-l-4 border-red-500"
                            : "bg-white text-slate-700 hover:bg-gray-50 shadow-md hover:shadow-lg"
                            }`}
                    >
                        <span className="font-medium">General Policies</span>
                    </button>
                    {Array.isArray(visaPolicyCategories) &&
                        visaPolicyCategories?.map(visa => (
                            <button
                                key={visa?.id}
                                onClick={() => setSelectedCategory(visa?.id)}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer ${selectedCategory === visa.id
                                    ? 'bg-slate-800 text-white shadow-lg border-l-4 border-red-500'
                                    : 'bg-white text-slate-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
                                    }`}
                            >
                                <span className="font-medium">{visa?.visa?.visa_type.charAt(0).toUpperCase() + visa?.visa?.visa_type.slice(1)} Policy</span>
                            </button>
                        ))
                    }
                </div>
            </div>

            {/* Policy Updates Notice */}
            <div className="bg-[#FAFAFA] border border-gray-200 rounded-2xl p-5">
                <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-[#e53935]" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#2c3e50] text-sm">Policy Updates</h3>
                        <p className="text-xs text-[#6c757d] mt-0.5 leading-relaxed">
                            Our visa policies are regularly updated to reflect current regulations.
                            {selectedCategory !== 'General Policies' && (
                                <span className="block mt-0.5">
                                    Last updated:{' '}
                                    {visaPolicyCategories?.find(p => p?.id === selectedCategory)?.visa_details?.[0]?.updated_at
                                        ? new Date(visaPolicyCategories.find(p => p?.id === selectedCategory).visa_details[0].updated_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                                        : 'Not available'}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleDownloadPolicyGuide}
                    className="flex items-center gap-2 text-xs font-bold text-[#2c3e50] border border-gray-200 bg-white px-3 py-2 rounded-xl hover:border-[#e53935] hover:text-[#e53935] transition-colors cursor-pointer">
                    <FileText className="w-3.5 h-3.5" />
                    Download Policy Guide
                </button>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-[#FAFAFA] border border-gray-200 rounded-2xl p-5">
                <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-[#e53935]" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#2c3e50] text-sm">Emergency Support</h3>
                        <p className="text-xs text-[#6c757d] mt-0.5 leading-relaxed">
                            24/7 emergency visa support hotline for urgent policy clarifications.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-[#2c3e50] pl-0.5">
                    <Phone className="w-4 h-4 text-[#e53935]" />
                    <span>+91-9098909890</span>
                </div>
            </div>
        </div>
    )
}

export default PolicySidebar