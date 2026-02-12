import React from 'react'
import QuickLinksRow from './QuickLinksRow'

const QuickLinks = ({quickActions}) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>

            <div className="space-y-3">
                {quickActions.map((action, idx) => (
                    <QuickLinksRow  key={idx} action={action} />
                ))}
            </div>
        </div>
    )
}

export default QuickLinks