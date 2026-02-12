import React from 'react'
import VisaForm from './VisaForm'
import { X } from 'lucide-react'

const AddVisa = ({ selectedCountry, setIsAddingVisaType, iconMapping, countryDetails }) => {
    return (
        <div className="bg-white rounded-xl border-2 border-blue-500 shadow-lg p-6 animate-slideIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Add New Visa Type</h2>
                    <p className="text-sm text-gray-600">Create a new visa type for {selectedCountry.name}</p>
                </div>
                <button onClick={() => setIsAddingVisaType(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <VisaForm setIsAddingVisaType={setIsAddingVisaType} selectedCountry={selectedCountry} iconMapping={iconMapping} countryDetails={countryDetails} />
        </div>
    )
}

export default AddVisa