import React from 'react'
import { Award, FileCheck, Shield } from 'lucide-react';

const achievements = [
    {
        icon: Award,
        title: "Excellence in Service",
        description: "Recognized for outstanding diplomatic services",
        bgColor: "bg-purple-50",
        iconColor: "bg-purple-100 text-purple-600"
    },
    {
        icon: Shield,
        title: "Security Certified",
        description: "ISO 27001 certified for data protection",
        bgColor: "bg-cyan-50",
        iconColor: "bg-cyan-100 text-cyan-600"
    },
    {
        icon: FileCheck,
        title: "Accredited Institution",
        description: "Fully accredited by international bodies",
        bgColor: "bg-emerald-50",
        iconColor: "bg-emerald-100 text-emerald-600"
    }
];

const AchievementSection = () => {

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements & Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {achievements.map((achievement, idx) => (
                    <div key={idx} className={`${achievement.bgColor} rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200`}>
                        <div className={`w-12 h-12 rounded-lg ${achievement.iconColor} flex items-center justify-center mb-4`}>
                            <achievement.icon size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{achievement.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{achievement.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AchievementSection