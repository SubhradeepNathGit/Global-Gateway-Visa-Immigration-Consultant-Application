import React from 'react'
import { CheckCircle } from 'lucide-react'

const OverviewSection = ({ course }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">About This Course</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{course?.full_description}</p>
            <h3 className="text-xl font-bold text-[#2C3E50] mb-4">What You'll Learn</h3>
            <div className="grid sm:grid-cols-2 gap-3">
                {course?.course_content?.[0]?.features?.map((f, i) => (
                    <div key={i} className="flex items-start bg-green-50 p-3 rounded-lg border border-green-100">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-800 text-sm font-medium">{f}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OverviewSection