import React from 'react'
import { Award, Star } from 'lucide-react'

const TrustBadage = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-700 ml-1">4.9/5</span>
                    </div>
                    <p className="text-xs text-slate-600">Rated by 2,500+ students</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-1">98% Success Rate</p>
                </div>
            </div>
        </div>
    )
}

export default TrustBadage