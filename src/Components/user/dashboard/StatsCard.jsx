import React from 'react'
import { Calendar, CreditCard, FileText, Info } from 'lucide-react';

const StatsCard = ({ visaApplications, appointments, uniqueCourses }) => {

    const stats = [
        { label: 'Total Applications', value: visaApplications?.length ?? 0, icon: FileText, color: 'bg-red-600' },
        { label: 'Pending Applications', value: visaApplications?.filter(p => p.status === 'pending')?.length ?? 0, icon: Info, color: 'bg-amber-600' },
        { label: 'Appointments', value: appointments?.filter(a => a.status === 'processing')?.length ?? 0, icon: Calendar, color: 'bg-violet-600' },
        { label: 'Puchase Course', value: uniqueCourses?.length ?? 0, icon: CreditCard, color: 'bg-emerald-600' }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg shadow-sm`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StatsCard