import React from 'react'
import { Building2 } from 'lucide-react'

const DashboardHeader = () => {
    return (
        <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/20">
                        <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-800 break-words">
                            Embassy Dashboard
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                            Welcome back! Here's your visa management overview
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DashboardHeader