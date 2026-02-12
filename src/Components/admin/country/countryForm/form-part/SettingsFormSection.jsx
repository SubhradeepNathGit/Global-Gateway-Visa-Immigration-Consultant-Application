import React from 'react'
import { Settings } from 'lucide-react'
import { Controller } from 'react-hook-form'

const SettingsFormSection = ({ SettingsSection, control, watch }) => {

    const ToggleSwitch = ({ label, description, checked }) => (
        <div className="flex items-start justify-between gap-4 opacity-70 cursor-not-allowed">
            <div className="flex-1">
                <div className="text-sm font-medium text-white mb-1">{label}</div>
                {description && <div className="text-xs text-slate-400">{description}</div>}
            </div>

            <button type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full flex-shrink-0 
                        ${checked ? 'bg-blue-600' : 'bg-slate-700'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white
                ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    );

    return (
        <SettingsSection title="Settings" description="Visibility and requirements" icon={Settings}>

            <Controller name="visaRequired" control={control} render={({ field }) =>
                <ToggleSwitch label="Visa Required" description="Visa unavailability for country" checked={watch("visaRequired")} />} />

            <Controller name="isActive" control={control} render={({ field }) =>
                <ToggleSwitch label="Active Status" description="Show to users" checked={watch("isActive") ? watch("isActive") : false} />} />

            <div className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
                <div className="text-sm font-medium text-white mb-2">Preview Status</div>
                <div className="flex items-center gap-2 flex-wrap text-xs">
                    {watch("visaRequired") && <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Visa Unavailable</span>}
                    <span className={`px-2 py-1 rounded-full border ${watch("isActive") ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-slate-500/20 text-slate-400 border-slate-500/30"}`}>{watch("isActive") ? "Active" : "Inactive"}</span>
                </div>
            </div>
        </SettingsSection>
    )
}

export default SettingsFormSection