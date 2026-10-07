import React from 'react'
import { School, Scale, Globe, Hand, BookOpen, FileText, BriefcaseBusiness } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { encodeBase64Url } from '../../../util/encodeDecode/base64';

const CourseCard = ({ course, index }) => {

    const navigate = useNavigate();

    const iconMap = {
        School: <School className="w-7 h-7 sm:w-8 sm:h-8 text-[#FF5252]" />,
        Globe: <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-[#FF5252]" />,
        Balance: <Scale className="w-7 h-7 sm:w-8 sm:h-8 text-[#FF5252]" />,
        Hand: <Hand className="w-7 h-7 sm:w-8 sm:h-8 text-[#FF5252]" />,
        Book: <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-[#FF5252]" />,
        File: <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-[#FF5252]" />,
    }

    const handleViewCourse = () => {
        navigate(`/course/${encodeBase64Url(String(course?.id))}`);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -6, scale: 1.01 }}
            onClick={handleViewCourse}
            className="w-full bg-white rounded-md overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col relative h-[420px] sm:h-[440px] cursor-pointer group"
        >
            {/* Pricing Badge */}
            <div className="absolute top-4 right-4 bg-[#FF5252] text-white rounded-[20px] px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold z-10 shadow-sm">
                ₹{parseInt(course?.pricing)?.toLocaleString('en-IN')}
            </div>

            {/* 60% — Image section */}
            <div className="h-[60%] w-full overflow-hidden relative">
                <img
                    src={course?.img_url}
                    alt={course?.course_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* 40% — Content section */}
            <div className="h-[40%] flex flex-col p-4 sm:p-5 justify-center">
                {/* Header: Icon beside name at left */}
                <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5">
                    <div className="shrink-0 text-[#FF5252] transition-transform duration-300 group-hover:scale-110">
                        {iconMap[course?.icon] ?? <BriefcaseBusiness className="w-7 h-7 sm:w-8 sm:h-8 text-[#FF5252]" />}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#2C3E50] group-hover:text-[#FF5252] transition-colors leading-snug line-clamp-2">
                        {course?.course_name ?? 'N/A'}
                    </h3>
                </div>

                {/* Course Description */}
                <p className="text-xs sm:text-sm text-[#7f8c8d] line-clamp-3 leading-relaxed">
                    {course?.description ?? 'N/A'}
                </p>
            </div>
        </motion.div>
    )
}

export default CourseCard