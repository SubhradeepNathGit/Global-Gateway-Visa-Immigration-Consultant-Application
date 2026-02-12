import React from 'react'
import { Headphones, MessageCircle } from 'lucide-react'

const SupportCard = ({ setShowSupportModal }) => {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-5 border border-blue-200">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Headphones className="w-5 h-5 text-blue-600" />
                Need Help?
            </h3>
            <p className="text-xs text-slate-600 mb-4">
                Our visa experts are here to assist you
            </p>
            <div className="space-y-2">
                <button
                    onClick={() => setShowSupportModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-blue-300 text-blue-700 px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-sm font-semibold"
                >
                    <MessageCircle className="w-4 h-4" />
                    View Contact Options
                </button>

            </div>
        </div>
    )
}

export default SupportCard