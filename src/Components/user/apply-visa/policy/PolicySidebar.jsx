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
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 shadow-md">
                <div className="flex items-start gap-2 mb-2">
                    <FileText className="w-5 h-5 text-amber-700 flex-shrink-0" />
                    <h3 className="font-bold text-amber-900">Policy Updates</h3>
                </div>
                <p className="text-sm text-amber-800 mb-3">
                    <span className='block'>Our visa policies are regularly updated to reflect current regulations.</span>
                    {selectedCategory === "General Policies" ? "" : `Last updated : 
                    ${visaPolicyCategories?.find(policy => policy?.id === selectedCategory)
                            ?.visa_details?.[0]?.updated_at
                            ? new Date(
                                visaPolicyCategories.find(policy => policy?.id === selectedCategory)
                                    .visa_details[0].updated_at
                            ).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                            : 'Not available'}`}
                </p>

                <button
                    onClick={handleDownloadPolicyGuide}
                    className="text-sm font-medium text-amber-900 border border-amber-900 px-3 py-1.5 rounded hover:bg-amber-100 transition-colors flex items-center gap-2 cursor-pointer">
                    <FileText className="w-4 h-4" />
                    Download Policy Guide
                </button>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 shadow-md">
                <div className="flex items-start gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-700 flex-shrink-0" />
                    <h3 className="font-bold text-green-900">Emergency Support</h3>
                </div>
                <p className="text-sm text-green-800 mb-3">
                    24/7 emergency visa support hotline available for urgent policy clarifications.
                </p>
                <div className="flex items-center gap-2 text-green-900 font-bold">
                    <Phone className="w-4 h-4" />
                    <span>+91-9098909890</span>
                </div>
            </div>
        </div>
    )
}

export default PolicySidebar