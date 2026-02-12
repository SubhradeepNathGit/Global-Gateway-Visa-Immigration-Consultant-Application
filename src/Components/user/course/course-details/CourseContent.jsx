import React from 'react'
import { CheckCircle } from 'lucide-react';
import OverviewSection from './course-content/OverviewSection';
import DocumentSection from './course-content/DocumentSection';
import InstructorSection from './course-content/InstructorSection';
import VideoSection from './course-content/VideoSection';
import CourseFeatures from './CourseFeatures';

const CourseContent = ({ isPurchased, course, activeTab, setActiveTab, ratingAvg, userCount, certificates, userAuthData }) => {

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                        <div className="flex border-b border-gray-200 bg-gray-50">
                            {['overview', 'content', 'instructor']?.map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3.5 px-4 font-semibold capitalize transition-all text-sm ${activeTab === tab ? 'bg-white text-[#FF5252] border-b-2 border-[#FF5252] -mb-px' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} cursor-pointer`}>
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="p-6">
                            {activeTab === 'overview' && (
                                <OverviewSection course={course} />
                            )}

                            {activeTab === 'content' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-[#2C3E50] mb-5">Course Content</h2>
                                    {/* ADD THIS ACCESS STATUS BANNER */}
                                    {isPurchased && (
                                        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                                                <div>
                                                    <p className="font-semibold text-green-900">Full Access Granted</p>
                                                    <p className="text-sm text-green-700">All videos and documents are now unlocked for you</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {/* Video Section */}
                                    <VideoSection isPurchased={isPurchased} course={course} />

                                    {/* Documents Section */}
                                    <DocumentSection isPurchased={isPurchased} course={course} certificates={certificates} userAuthData={userAuthData} />
                                </div>
                            )}

                            {activeTab === 'instructor' && (
                                <InstructorSection course={course} ratingAvg={ratingAvg} userCount={userCount} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <CourseFeatures course={course} />
            </div>
        </div>
    )
}

export default CourseContent