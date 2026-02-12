import React from 'react'
import { ArrowRight, BookOpen } from 'lucide-react'

const NoAvailableCourse = ({handleBrowseCourses}) => {
    return (
        <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mb-6">
                <BookOpen className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
                No Courses Purchased Yet
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Start your learning journey by purchasing courses from our catalog
            </p>
            <button
                onClick={handleBrowseCourses}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
                Browse Courses
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    )
}

export default NoAvailableCourse