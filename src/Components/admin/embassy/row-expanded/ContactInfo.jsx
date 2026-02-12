import React from 'react'
import { PhoneCall } from 'lucide-react'
import { Link } from 'react-router-dom'

const ContactInfo = ({ embassy }) => {
    return (
        <div className="bg-slate-700/30 backdrop-blur-sm rounded-lg p-4 border border-slate-600/50">
            <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-pink-400" />
                Contact Information
            </h5>
            <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                    <span className="text-slate-500 min-w-[80px]">Address:</span>
                    <span className="text-slate-300">{embassy?.address ?? 'N/A'}</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="text-slate-500 min-w-[80px]">Email:</span>
                    <span className="text-slate-300">{embassy?.email ?? 'N/A'}</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="text-slate-500 min-w-[80px]">Phone:</span>
                    <span className="text-slate-300">{embassy?.contact_no ?? 'N/A'}</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="text-slate-500 min-w-[80px]">Website:</span>
                    <span className="text-slate-300">
                        {embassy?.website_url ? (<Link className='hover:text-blue-400' to={embassy.website_url}>{embassy.website_url}</Link>) : 'N/A'}
                    </span>
                </div>
            </div>           
        </div>
    )
}

export default ContactInfo