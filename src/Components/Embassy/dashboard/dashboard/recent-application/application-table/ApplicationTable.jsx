import React from 'react'
import ApplicationTableRow from './ApplicationTableRow'

const ApplicationTable = ({ recentApplications }) => {
    // console.log('Recent applications', recentApplications);

    return (
        <div className="flex-1 overflow-y-auto glass-scrollbar">
            <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">Application ID</th>
                        <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">Applicant</th>
                        <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">Type</th>
                        <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">Applied on</th>
                        <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">Status</th>
                        <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {recentApplications?.slice(0, 11)?.map((app, idx) => (
                        <ApplicationTableRow key={idx} app={app} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ApplicationTable