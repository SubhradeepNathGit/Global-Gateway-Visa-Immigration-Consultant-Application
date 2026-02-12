import React from 'react'

const CountryInputField = ({ label, name, disabled = false, value, onChange }) => {

    return (
        <div className="relative">
            <input
                type="text"
                name={name}
                value={value}
                disabled={disabled}
                onChange={onChange}
                placeholder=" "
                className={`w-full px-4 py-3 rounded-md bg-transparent text-white placeholder-white/70
          border border-white/50 focus:border-white transition duration-300 focus:outline-none peer ${disabled ? 'cursor-not-allowed' : ''}`}
            />
            <label
                className="absolute left-3 transition-all duration-300 pointer-events-none
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/70
          peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-black/50 peer-focus:px-1 peer-focus:text-white
          peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs
          peer-[:not(:placeholder-shown)]:bg-black/50 peer-[:not(:placeholder-shown)]:px-1"
            >
                {label}
            </label>
        </div>
    )
}

export default CountryInputField