import React from 'react'
import { AlertCircle, Plus } from 'lucide-react'

const EmptyVisa = ({ selectedCountry, setIsAddingVisaType }) => {
    return (
        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Visa Types Yet</h3>
            <p className="text-sm text-gray-600 mb-6">
                Get started by adding visa types for {selectedCountry?.name}
            </p>
            <button
                onClick={() => setIsAddingVisaType(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
            >
                <Plus className="w-5 h-5" />
                Add First Visa Type
            </button>
        </div>
    )
}

export default EmptyVisa