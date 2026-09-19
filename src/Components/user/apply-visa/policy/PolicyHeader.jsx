import React from 'react'
import { Clock, Calendar, CircleCheck, IndianRupee, CircleX, CircleAlert, DoorOpen } from 'lucide-react';

const PolicyHeader = ({ currentPolicy }) => {
    if (!currentPolicy) return null;

    const rawStatus = currentPolicy.status?.toLowerCase();
    const normalizedStatus = rawStatus === 'active' ? 'active' : rawStatus === 'inactive' ? 'inactive' : currentPolicy.status;

    const StatusIcon = normalizedStatus === 'active' ? CircleCheck : normalizedStatus === 'inactive' ? CircleX : CircleAlert;
    const statusColor = normalizedStatus === 'active' ? 'text-emerald-600' : normalizedStatus === 'inactive' ? 'text-[#e53935]' : 'text-amber-500';
    const statusBadge = normalizedStatus === 'active'
        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        : normalizedStatus === 'inactive'
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-amber-50 text-amber-700 border border-amber-200';

    const infoItems = [
        {
            icon: Clock,
            label: 'Processing Time',
            value: currentPolicy.processingTime,
        },
        {
            icon: Calendar,
            label: 'Validity Period',
            value: currentPolicy.validityPeriod,
        },
        {
            icon: DoorOpen,
            label: 'Visa Type',
            value: currentPolicy.visaType,
        },
        {
            icon: IndianRupee,
            label: 'Application Fees',
            value: currentPolicy.fees,
        },
    ];

    return (
        <div className="mb-6">
            {/* Hero */}
            <div className="relative rounded-2xl overflow-hidden mb-6">
                <div className="relative h-48 md:h-60 bg-gradient-to-br from-[#1e293b] to-[#0f172a] flex items-center justify-center text-center px-6">
                    {/* Subtle diagonal line pattern */}
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
                        backgroundSize: '12px 12px'
                    }} />
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-[#e53935] uppercase tracking-[0.25em] mb-3">
                            Visa Policy
                        </p>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                            {currentPolicy.title}
                        </h2>
                        <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            {currentPolicy.description || 'Review the policy details and requirements for this visa type.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Info strip */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-gray-100">
                    {infoItems.map(({ icon: Icon, label, value }, i) => (
                        <div
                            key={label}
                            className="group flex flex-col items-center justify-center gap-3 py-5 px-4 hover:bg-[#FAFAFA] transition-colors duration-200"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[#FAFAFA] border border-gray-100 flex items-center justify-center group-hover:bg-[#e53935] group-hover:border-[#e53935] transition-all duration-300">
                                <Icon className="w-4 h-4 text-[#6c757d]/70 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <div className="text-center">
                                <p className="text-[9px] font-black text-[#6c757d] uppercase tracking-[0.18em] opacity-60 mb-1">
                                    {label}
                                </p>
                                <p className="text-sm font-bold text-[#2c3e50] leading-snug">
                                    {value}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Status — last cell */}
                    <div className="group flex flex-col items-center justify-center gap-3 py-5 px-4 hover:bg-[#FAFAFA] transition-colors duration-200">
                        <div className="w-10 h-10 rounded-xl bg-[#FAFAFA] border border-gray-100 flex items-center justify-center group-hover:bg-[#e53935] group-hover:border-[#e53935] transition-all duration-300">
                            <StatusIcon className={`w-4 h-4 ${statusColor} group-hover:text-white transition-colors duration-300`} />
                        </div>
                        <div className="text-center">
                            <p className="text-[9px] font-black text-[#6c757d] uppercase tracking-[0.18em] opacity-60 mb-1">
                                Policy Status
                            </p>
                            <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${statusBadge}`}>
                                {normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PolicyHeader;
