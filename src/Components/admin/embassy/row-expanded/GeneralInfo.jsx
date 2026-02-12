import React from 'react'
import { Mail } from 'lucide-react'

const GeneralInfo = ({ embassy }) => {

    return (
        <div className="bg-slate-700/30 backdrop-blur-sm rounded-lg p-4 border border-slate-600/50">
            <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                General Information
            </h5>
            <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                    <span className="text-slate-500 min-w-[80px]">ID:</span>
                    <span className="text-slate-300">{embassy?.id ? embassy?.id?.slice(0, 25) + '...' : ''}</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="text-slate-500 min-w-[80px]">Name:</span>
                    <span className="text-slate-300">{embassy?.country_name ?? ''} Embassy</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="text-slate-500 min-w-[80px]">Country:</span>
                    <span className="text-slate-300">{embassy?.country_name ?? 'N/A'}</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="text-slate-500 min-w-[80px]">Established:</span>
                    <span className="text-slate-300">{embassy?.establish_date?.split("-")?.reverse()?.join("-") ?? 'N/A'}</span>
                </div>
            </div>
        </div>
    )
}

export default GeneralInfo