import React from 'react'
import { Link2, Mail, MapPin, PhoneOutgoing } from 'lucide-react'
import { Link } from 'react-router-dom'

const EmbassyContactSection = ({ selectedDocument }) => {
    return (
        <div className="mt-6 pt-6 border-t border-slate-600/50">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">Contact Information</p>
            <div className="space-y-3 flex-row md:flex w-full items-center justify-between">
                <div className='w-full'>
                    <div className="flex items-center md:gap-3 gap-1 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                            <PhoneOutgoing className="w-5 h-5 text-orange-400" />
                        </div>
                        <span className="text-white md:font-medium font-sm truncate max-w-[20ch] md:max-w-none">{selectedDocument?.contact_no ?? 'N/A'}</span>
                    </div>
                    <div className="flex items-center md:gap-3 gap-1">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                            <Mail className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-white md:font-medium font-sm truncate max-w-[20ch] md:max-w-none">{selectedDocument?.email ?? 'N/A'}</span>
                    </div>
                </div>
                <div className='w-full'>
                    <div className="flex items-center md:gap-3 gap-1 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                            <MapPin className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className="text-white md:font-medium font-sm truncate max-w-[20ch] md:max-w-none">{selectedDocument?.address ?? 'N/A'}</span>
                    </div>
                    <div className="flex items-center md:gap-3 gap-1">
                        <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
                            <Link2 className="w-5 h-5 text-yellow-400" />
                        </div>
                        <span className="text-white md:font-medium font-sm truncate max-w-[20ch] md:max-w-none">{selectedDocument?.website_url ? (<Link className='hover:text-blue-400' to={selectedDocument.website_url}>{selectedDocument.website_url}</Link>) : 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default EmbassyContactSection