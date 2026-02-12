import React from 'react'
import { Globe, Mail, Clock } from "lucide-react";

const CourseDetails = ({ InfoRow, cartItems }) => {

    return (
        <div className="space-y-4 h-[185px] overflow-y-auto glass-scrollbar">
            {cartItems?.map(course => (
                <div key={course?.id}
                    className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 items-center">
                        {/* Left side */}
                        <div className="space-y-2">
                            <InfoRow icon={Mail} label="Course Name" value={course?.courses?.course_name ?? 'N/A'}
                                className="text-slate-900 font-semibold" />

                            <InfoRow icon={Globe} label="Language" value={course?.courses?.language ?? 'N/A'}
                                className="text-slate-700" />
                        </div>

                        {/* Right side */}
                        <div className="flex sm:justify-end items-center">
                            <div className="bg-green-50 text-green-700 w-30 py-1.5 rounded-full font-semibold text-sm border border-green-100 flex items-center justify-center gap-2">
                                <Clock className="w-4 h-4" />
                                {course?.courses?.skill_level ?? 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>


    )
}

export default CourseDetails