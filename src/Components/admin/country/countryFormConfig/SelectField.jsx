import React from 'react'

const SelectField = ({ label, id, register, options, error }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
            <select id={id} {...register} className={`w-full px-4 py-2.5 bg-slate-700/30 border ${error ? 'border-red-500/50' : 'border-slate-600/50'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm appearance-none cursor-pointer`}>
                <option value="">Select {label}</option>
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {error && <p className="mt-1 text-xs text-red-400">{error.message}</p>}
        </div>
    )
}

export default SelectField