import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const QuickLinksRow = ({ action }) => {
    const navigate = useNavigate();
    
    return (
        <button onClick={() => navigate(action.path)}
            className="w-full group relative overflow-hidden flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 border border-blue-200/50 backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
        >
            <div className="w-10 h-10 rounded-lg bg-white/50 backdrop-blur-sm flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform shadow-sm">
                <action.icon size={20} />
            </div>
            <div className="flex-1 text-left">
                <p className="font-semibold text-sm text-gray-900">{action.label}</p>
                <p className="text-xs text-gray-600 mt-0.5">{action.count}</p>
            </div>
            <ArrowRight size={18} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
        </button>
    )
}

export default QuickLinksRow