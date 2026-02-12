import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import ApplicationRow from './ApplicationRow';

const ApplicationTable = ({ isApplicationLoading, filteredApplications, currentPage }) => {

    const [itemsPerPage] = useState(10);

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredApplications?.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-600/50 bg-slate-800/50">
                            <th className="px-4 py-4 text-left text-xs md:text-sm font-semibold text-slate-300">Application ID</th>
                            <th className="px-4 py-4 text-left text-xs md:text-sm font-semibold text-slate-300">Applicant Name</th>
                            <th className="px-4 py-4 text-left text-xs md:text-sm font-semibold text-slate-300 hidden md:table-cell">From Country</th>
                            <th className="px-4 py-4 text-left text-xs md:text-sm font-semibold text-slate-300 hidden lg:table-cell">Applied For</th>
                            <th className="px-4 py-4 text-left text-xs md:text-sm font-semibold text-slate-300 hidden xl:table-cell">Visa Type</th>
                            <th className="px-4 py-4 text-left text-xs md:text-sm font-semibold text-slate-300">Status</th>
                            <th className="px-4 py-4 text-left text-xs md:text-sm font-semibold text-slate-300 hidden lg:table-cell">Apply Date</th>
                            <th className="px-4 py-4 text-left text-xs md:text-sm font-semibold text-slate-300 hidden xl:table-cell">Decision Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems?.map(app => (
                            <ApplicationRow key={app.id} app={app} />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Loading */}
            {isApplicationLoading && (
                <div className="text-center py-12">
                    <Loader2 className="w-16 h-16 text-white animate-spin mx-auto text-center" />
                    <p className="text-slate-400 text-lg">Loading...</p>
                </div>
            )}

            {!isApplicationLoading && filteredApplications?.length === 0 && (
                <div className="text-center py-12">
                    <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-slate-400 text-lg">No applications found</p>
                </div>
            )}

            {/* Pagination */}
            <div className="px-4 md:px-6 py-4 border-t border-slate-600/50 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-xs md:text-sm text-slate-400">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredApplications?.length)} of {filteredApplications?.length} applications
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 md:px-4 py-2 bg-slate-700/30 border border-slate-600/50 rounded-lg hover:bg-slate-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 md:gap-2 text-xs md:text-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden md:inline">Previous</span>
                    </button>

                    <div className="flex items-center gap-1 md:gap-2">
                        {[...Array(totalPages)].slice(0, 5).map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 md:px-4 py-2 rounded-lg transition-colors text-xs md:text-sm ${currentPage === i + 1
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-700/30 border border-slate-600/50 hover:bg-slate-700/50'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 md:px-4 py-2 bg-slate-700/30 border border-slate-600/50 rounded-lg hover:bg-slate-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 md:gap-2 text-xs md:text-sm"
                    >
                        <span className="hidden md:inline">Next</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ApplicationTable