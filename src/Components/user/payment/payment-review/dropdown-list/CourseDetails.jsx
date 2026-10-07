import React from 'react'
import { Globe, Clock } from "lucide-react";
import { BookOpen } from "lucide-react";

const CourseDetails = ({ InfoRow, cartItems }) => {

    return (
        <div className="space-y-3">
            {cartItems?.map((course, idx) => (
                <div key={course?.id}
                    className="bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all p-4 flex items-center justify-between gap-4">

                    {/* Index badge + Info */}
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-xs font-bold text-cyan-700">
                            {idx + 1}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate leading-snug">
                                {course?.courses?.course_name ?? 'N/A'}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
                                <Globe className="w-3 h-3 flex-shrink-0" />
                                <span>{course?.courses?.language ?? 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Skill level badge */}
                    <div className="flex-shrink-0 bg-green-50 text-green-700 px-3 py-1 rounded-full font-semibold text-xs border border-green-100 flex items-center gap-1.5 whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        {course?.courses?.skill_level ?? 'N/A'}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CourseDetails