import React from 'react'
import { ArrowRight, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const RecentApplicationHeader = () => {
    const navigate = useNavigate();
    
    return (
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
            <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Filter size={18} className="text-gray-600" />
                </button>
                <button
                    onClick={() => navigate("/embassy/dashboard/applications")}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                    View All
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    )
}

export default RecentApplicationHeader