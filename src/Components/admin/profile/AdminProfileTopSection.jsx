import { Shield } from 'lucide-react';
import React from 'react'

const AdminProfileTopSection = ({profile}) => {

    const getInitials = (name) => name?.split(" ")?.map((n) => n[0])?.join("")?.toUpperCase()?.slice(0, 2);

    return (
        <div className="flex items-center gap-5">
            <div className="w-18 h-18 sm:w-20 sm:h-20 md:w-30 md:h-30 rounded-full bg-gradient-to-br from-gray-600 to-white/10 flex items-center justify-center text-white text-3xl md:text-5xl font-bold shadow-lg ring-4 ring-slate-400" aria-label={`Profile picture for ${profile.name}`}>
                {getInitials(profile?.name)}
            </div>
            <div>
                <h2 className="text-xl md:text-3xl font-bold text-white">{profile?.name}</h2>
                <p className="text-blue-400 font-medium text-sm md:text-base">{profile?.role}</p>
                <div className="flex items-center gap-2 mt-1 text-slate-400 text-xs md:text-sm">
                    <Shield className="w-4 h-4" />
                    <span>Full Access</span>
                </div>
            </div>
        </div>
    )
}

export default AdminProfileTopSection