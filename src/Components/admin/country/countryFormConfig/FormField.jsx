import React from 'react'

const FormField = ({ label, id, type = "text", placeholder, register, helper, error, rows, readOnly, maxLength }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
            {type === "textarea" ? (
                <textarea id={id} readOnly={readOnly} rows={rows || 3} placeholder={placeholder} maxLength={maxLength} {...register} className={`w-full px-4 py-2.5 bg-slate-700/30 border ${error ? 'border-red-500/50' : 'border-slate-600/50'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none`} />
            ) : (
                <input id={id} readOnly={readOnly} type={type} placeholder={placeholder} maxLength={maxLength} {...register} className={`w-full px-4 py-2.5 bg-slate-700/30 border ${error ? 'border-red-500/50' : 'border-slate-600/50'} rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm`} />
            )}
            {error && <p className="mt-1 text-xs text-red-400">{error.message}</p>}
            {helper && <p className="mt-1 text-xs text-slate-400">{helper}</p>}
        </div>
    )
}

export default FormField