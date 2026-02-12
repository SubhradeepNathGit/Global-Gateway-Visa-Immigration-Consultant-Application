import { Loader2, RefreshCw, Save } from 'lucide-react';
import React from 'react'
import { useSelector } from 'react-redux';

const FormBtnSection = ({ country, isSubmitting, uploading, handleSubmit, onClose, onSubmit, handleReset }) => {

    const { isAllCountryListLoading, getAllCountryList, isAllCountryListError } = useSelector(state => state.allCountry);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-6 border-t border-slate-700/50 flex-shrink-0">

            <button type="button" onClick={() => { handleReset() }} disabled={isSubmitting || uploading} className="px-4 py-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 text-white text-sm transition-all flex items-center gap-2 disabled:opacity-50 justify-center sm:justify-start cursor-pointer"><RefreshCw className="w-4 h-4" /><span className="hidden sm:inline">Reset</span></button>

            <div className="flex gap-2">
                <button type="button" onClick={onClose} disabled={isSubmitting || uploading} className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 text-white text-sm transition-all disabled:opacity-50 cursor-pointer">Cancel</button>
                <button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting || uploading} className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 text-white text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer">
                    {(isAllCountryListLoading || isSubmitting || uploading) ? <><Loader2 className="w-4 h-4 animate-spin" /><span className="hidden sm:inline">Saving...</span></> : <><Save className="w-4 h-4" /><span className="hidden sm:inline">{country ? 'Update' : 'Save'} Country</span></>}
                </button>
            </div>

        </div>
    )
}

export default FormBtnSection