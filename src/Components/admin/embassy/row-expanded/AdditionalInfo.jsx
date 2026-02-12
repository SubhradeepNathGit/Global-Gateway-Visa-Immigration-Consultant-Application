import React from 'react'
import {  Shield } from 'lucide-react'
import { formatDateTimeMeridian } from '../../../../util/dateFormat/dateFormatConvertion'

const AdditionalInfo = ({ embassy }) => {
    return (
        <div className="bg-slate-700/30 backdrop-blur-sm rounded-lg p-4 border border-slate-600/50">
            <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                Additional Information
            </h5>
            <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                    <span className="text-slate-500 min-w-[80px]">Last Signin:</span>
                    <span className="text-slate-300">
                        {formatDateTimeMeridian(embassy?.last_sign_in_at) ?? 'N/A'}
                    </span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="text-slate-500 min-w-[80px]">Provider:</span>
                    <span className="text-slate-300">
                        {embassy?.providers ? embassy?.providers?.charAt(0)?.toUpperCase() + embassy?.providers?.slice(1)?.toLowerCase() : 'N/A'}
                    </span>
                </div>
                 <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                    <span className="text-slate-500 min-w-[80px]">Schedule:</span>
                    <span className="text-slate-300">{embassy?.starting_hours + '-' + embassy?.ending_hours}</span>
                </div>
            </div>
                <div className="flex items-start gap-2">
                    <span className="text-slate-500 min-w-[80px]">Status:</span>
                    <span className={`capitalize font-medium ${embassy?.is_approved === 'fulfilled' ? 'text-green-400' : embassy?.is_approved === 'pending' ? 'text-yellow-400' : 'text-red-400'}`}>
                        {embassy?.is_approved === 'fulfilled' ? 'Approved' : embassy?.is_approved === 'pending' ? 'Pending' : 'Rejected'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default AdditionalInfo