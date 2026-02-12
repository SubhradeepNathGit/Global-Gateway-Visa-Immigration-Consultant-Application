import React from 'react'
import { Info } from 'lucide-react'

const ImportantNotes = () => {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-2">Important Information:</p>
                    <ul className="space-y-1 text-blue-800">
                        <li>• Instant access to course materials after payment</li>
                        <li>• Consultation sessions can be scheduled within 24 hours</li>
                        <li>• All services include email support for 6 months</li>
                        <li>• 30-day money-back guarantee applies to all purchases</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ImportantNotes