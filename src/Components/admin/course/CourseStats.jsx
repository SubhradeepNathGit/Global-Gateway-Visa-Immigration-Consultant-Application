import React from 'react'
import { BarChart, BookOpen, Users } from 'lucide-react'

const CourseStats = ({courses}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{courses?.length}</p>
                        <p className="text-sm text-slate-400">Total Courses</p>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                        <Users className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">
                            {courses.reduce((sum, c) => sum + (c.students || 0), 0)}
                        </p>
                        <p className="text-sm text-slate-400">Total Lerners</p>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <BarChart className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">
                            {courses?.filter(c => c?.status === 'active')?.length}
                        </p>
                        <p className="text-sm text-slate-400">Active Courses</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseStats