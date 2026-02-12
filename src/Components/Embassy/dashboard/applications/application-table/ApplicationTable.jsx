import React from 'react'
import DesktopTable from './DesktopTable'
import MobileCard from './MobileCard'
import { FileText } from 'lucide-react'

const ApplicationTable = ({ filteredApplications }) => {

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Application ID
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Applicant
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Visa Type
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Origin
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Submitted
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredApplications.map((app) => (
                            <DesktopTable key={app.id} app={app} />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
                {filteredApplications.map((app) => (
                    <MobileCard key={app.id} app={app} />
                ))}
            </div>

            {/* Empty State */}
            {filteredApplications.length === 0 && (
                <div className="text-center py-12">
                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No applications found
                    </h3>
                    <p className="text-gray-600">
                        Try adjusting your search or filter criteria
                    </p>
                </div>
            )}

        </div>
    )
}

export default ApplicationTable
