import React from 'react'
import { Globe, Clock, Users, CheckCircle, Star, Video } from 'lucide-react';

const CourseDetailsHeader = ({ isPurchased, course, ratingAvg, ratingCount, userCount }) => {

    return (
        <div className="lg:col-span-3 mt-20 space-y-6">
            {/* PURCHASED BADGE */}
            {isPurchased && (
                <div className="inline-flex mb-10 items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    <CheckCircle className="w-5 h-5" />
                    Course Purchased - Full Access Unlocked
                </div>
            )}
            {/* Badges */}
            <div className="flex items-center gap-3">
                <span className="bg-[#FF5252] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                    {course?.skill_level ?? 'N/A'}
                </span>
                <div className="flex items-center gap-1.5">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{ratingAvg ?? '0'}/5</span>
                    <span className="text-white/70 text-sm">({ratingCount ?? '0'} reviews)</span>
                </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                {course?.course_name ?? 'N/A'}
            </h1>

            {/* Description */}
            <p className="text-lg text-white/90 leading-relaxed">
                {course?.description ?? 'N/A'}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 text-white/90">
                {/* <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#FF5252]" />
                    <span className="text-base">{course?.duration ??'N/A'}</span>
                </div> */}
                <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-[#FF5252]" />
                    <span className="text-base">{(course?.course_content?.[0]?.documents?.length + 1) ?? 'N/A'} lectures</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#FF5252]" />
                    <span className="text-base">{userCount?.length ?? '0'} student{Number(userCount?.length) > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#FF5252]" />
                    <span className="text-base">{course?.language ?? 'N/A'}</span>
                </div>
            </div>

            {/* Instructor */}
            <div>
                <p className="text-sm text-white/70 mb-2">Instructor</p>
                <p className="text-xl font-semibold">{course?.instructor?.name ?? 'N/A'}</p>
            </div>
        </div>
    )
}

export default CourseDetailsHeader