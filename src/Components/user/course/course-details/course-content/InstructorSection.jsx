import React from 'react'
import { Star, Users } from 'lucide-react'

const InstructorSection = ({ course, ratingAvg, userCount }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">About the Instructor</h2>
            <div className="flex mt-10 items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF5252] to-[#E63946] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {course?.instructor?.name?.split(' ')?.map(n => n[0])?.join('')}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{course?.instructor?.name ?? 'N/A'}</h3>
                    <p className="text-gray-600">{course?.instructor?.bio ?? 'N/A'}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center"><Users className="w-4 h-4 mr-1" />{userCount?.length ?? '0'} student{Number(userCount?.length) > 1 ? 's' : ''}</span>
                        <span className="flex items-center"><Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />{ratingAvg ?? '0'} rating</span>
                    </div>
                </div>
            </div>
            <p className="text-gray-700 leading-relaxed">With over 15 years of experience in immigration consulting, our instructor has helped thousands of students achieve their dreams of studying and working abroad. Certified by multiple immigration boards, they bring real-world expertise and proven strategies to every course.</p>
        </div>
    )
}

export default InstructorSection