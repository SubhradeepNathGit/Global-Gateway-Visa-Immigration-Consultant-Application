import React from 'react'
import { School, Scale, Globe, Hand, BookOpen, FileText, BriefcaseBusiness } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { encodeBase64Url } from '../../../util/encodeDecode/base64';

const CourseCard = ({ course, index }) => {

    const navigate = useNavigate();

    const iconMap = {
        School: <School className="w-10 h-10 text-[#FF5252]" />,
        Globe: <Globe className="w-10 h-10 text-[#FF5252]" />,
        Balance: <Scale className="w-10 h-10 text-[#FF5252]" />,
        Hand: <Hand className="w-10 h-10 text-[#FF5252]" />,
        Book: <BookOpen className="w-10 h-10 text-[#FF5252]" />,
        File: <FileText className="w-10 h-10 text-[#FF5252]" />,
    }

    const handleViewCourse = (courseId) => {
        navigate(`/course/${encodeBase64Url(String(courseId))}`);
    }

    const ArrowIcon = () => (
        <span className="inline-block ml-2 animate-bounce-x">→</span>
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.02 }}
            className="w-full bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col relative"
        >
            <div className="absolute top-4 right-4 bg-[#FF5252] text-white rounded-[20px] px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold z-10">
                ₹{parseInt(course?.pricing)?.toLocaleString('en-IN')}
            </div>

            <div className="h-[180px] sm:h-[200px] w-full overflow-hidden relative">
                <img src={course?.img_url} alt={course?.course_name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>

            <div className="flex-1 flex flex-col p-4 sm:p-6">
                <div className="flex justify-center mb-2 sm:mb-3">
                    {iconMap[course?.icon] ?? <BriefcaseBusiness />}
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-[#2C3E50] text-center mb-2 min-h-[3rem] flex items-center justify-center">
                    {course?.course_name ?? 'N/A'}
                </h3>

                <p className="text-xs sm:text-sm text-[#7f8c8d] text-center mb-4 flex-grow line-clamp-3">
                    {course?.description ?? 'N/A'}
                </p>

                <div className="flex justify-center mt-auto">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleViewCourse(course?.id)}
                        className="flex items-center border border-[#E0E0E0] text-[#666] px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-medium hover:border-[#FF5252] hover:text-[#FF5252] hover:bg-[rgba(255,82,82,0.04)] transition-all duration-200 cursor-pointer"
                    >
                        View Course
                        <ArrowIcon />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

export default CourseCard