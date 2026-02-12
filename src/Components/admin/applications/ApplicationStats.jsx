import React from 'react'

const ApplicationStats = ({stats}) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-xs md:text-sm mb-1">Total Applications</p>
                        <p className="text-2xl md:text-3xl font-bold">{stats.total}</p>
                    </div>
                    <div className="bg-blue-500/20 p-2 md:p-3 rounded-lg">
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-xs md:text-sm mb-1">Processing</p>
                        <p className="text-2xl md:text-3xl font-bold">{stats.processing}</p>
                    </div>
                    <div className="bg-yellow-500/20 p-2 md:p-3 rounded-lg">
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-xs md:text-sm mb-1">Approved</p>
                        <p className="text-2xl md:text-3xl font-bold">{stats.approved}</p>
                    </div>
                    <div className="bg-green-500/20 p-2 md:p-3 rounded-lg">
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-xs md:text-sm mb-1">Rejected</p>
                        <p className="text-2xl md:text-3xl font-bold">{stats.rejected}</p>
                    </div>
                    <div className="bg-red-500/20 p-2 md:p-3 rounded-lg">
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ApplicationStats