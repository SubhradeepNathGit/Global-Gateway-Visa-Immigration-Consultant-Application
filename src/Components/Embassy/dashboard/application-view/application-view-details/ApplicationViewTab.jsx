import React from 'react'
import { Clock, FileText, Shield, User } from 'lucide-react';

const ApplicationViewTab = ({ activeTab, setActiveTab }) => {

    const tabs = [
        { id: "personal", label: "Personal Info", icon: User },
        { id: "visa", label: "Visa Details", icon: FileText },
        { id: "documents", label: "Documents", icon: Shield },
        { id: "timeline", label: "Timeline", icon: Clock }
    ];

    return (
        <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex">
                {tabs?.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.id
                                ? "border-blue-600 text-blue-600 bg-blue-50"
                                : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    )
}

export default ApplicationViewTab