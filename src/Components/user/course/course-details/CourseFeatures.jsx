import React from 'react'
import { Globe, FileText, Clock, BarChart, Award, Calendar, Video } from 'lucide-react';

const CourseFeatures = ({ course }) => {

    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4 border border-gray-100">
                <h3 className="text-xl font-bold text-[#2C3E50] mb-4">Course Features</h3>
                <div className="space-y-4">
                    {/* <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <div className="flex items-center text-gray-700">
                            <Clock className="w-5 h-5 mr-3 text-[#FF5252]" />
                            <span>Duration</span>
                        </div>
                        <span className="font-semibold">{course?.duration}</span>
                    </div> */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <div className="flex items-center text-gray-700">
                            <Video className="w-5 h-5 mr-3 text-[#FF5252]" />
                            <span>Video</span>
                        </div>
                        <span className="font-semibold">1</span>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <div className="flex items-center text-gray-700">
                            <FileText className="w-5 h-5 mr-3 text-[#FF5252]" />
                            <span>Documents</span>
                        </div>
                        <span className="font-semibold">{course?.course_content?.[0]?.documents?.length ?? 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <div className="flex items-center text-gray-700">
                            <BarChart className="w-5 h-5 mr-3 text-[#FF5252]" />
                            <span>Level</span>
                        </div>
                        <span className="font-semibold">{course?.skill_level ?? 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <div className="flex items-center text-gray-700">
                            <Globe className="w-5 h-5 mr-3 text-[#FF5252]" />
                            <span>Language</span>
                        </div>
                        <span className="font-semibold">{course?.language ?? 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <div className="flex items-center text-gray-700">
                            <Award className="w-5 h-5 mr-3 text-[#FF5252]" />
                            <span>Certificate</span>
                        </div>
                        <span className="font-semibold">Yes</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-700">
                            <Calendar className="w-5 h-5 mr-3 text-[#FF5252]" />
                            <span>Access</span>
                        </div>
                        <span className="font-semibold">Lifetime</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseFeatures