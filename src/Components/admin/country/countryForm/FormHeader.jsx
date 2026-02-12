import { X } from 'lucide-react'
import React from 'react'

const FormHeader = ({ country, onClose }) => {
    return (
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 flex-shrink-0">
            <div>
                <h2 className="text-2xl font-bold text-white">{country ? 'Edit Country' : 'Register New Country'}</h2>
                <p className="text-sm text-slate-400 mt-1">{country ? 'Update country information' : 'Add a new country to Global Gateway'}</p>
            </div>
            <button onClick={onClose} type="button" className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors cursor-pointer"><X className="w-5 h-5 cursor-pointer" /></button>
        </div>
    )
}

export default FormHeader