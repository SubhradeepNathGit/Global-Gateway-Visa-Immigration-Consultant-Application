import { Plus } from 'lucide-react';
import React from 'react'

const CountryHeader = ({ setSelectedCountry, setIsModalOpen }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                    Manage Countries
                </h1>
                <p className="text-slate-400">Manage and Add new countries</p>
            </div>

            <button
                onClick={() => {
                    setSelectedCountry(null);
                    setIsModalOpen(true);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 text-white text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Country</span>
            </button>
        </div>
    )
}

export default CountryHeader