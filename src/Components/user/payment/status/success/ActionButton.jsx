import { Download, Home, Share2 } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const ActionButton = ({ handlePrintReceipt, handleShareStatus }) => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-3 gap-4 mb-8 md:mb-10 print:hidden">

            <button
                onClick={handlePrintReceipt}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            >
                <Download size={18} />
                <span className="hidden md:inline">Download Receipt</span>
            </button>

            <button
                onClick={handleShareStatus}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            >
                <Share2 size={18} />
                <span className="hidden md:inline">Share Status</span>
            </button>

            <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            >
                <Home size={18} />
                <span className="hidden md:inline">Go to Dashboard</span>
            </button>

        </div>
    )
}

export default ActionButton