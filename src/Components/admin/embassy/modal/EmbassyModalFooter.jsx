import React from 'react'
import { ExternalLink, Printer } from 'lucide-react'

const EmbassyModalFooter = ({selectedDocument}) => {
    return (
        <div className="flex gap-4">
            <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-slate-700/30 hover:bg-slate-700/40 text-white rounded-lg transition-all duration-200 border border-slate-600/50 font-semibold cursor-pointer"
            >
                <Printer className="w-5 h-5" />
                <span>Print</span>
            </button>

            <button
                onClick={() => window.open(selectedDocument?.document, '_blank')}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-slate-700/30 hover:bg-slate-700/40 text-white rounded-lg transition-all duration-200 border border-slate-600/50 font-semibold cursor-pointer"
            >
                <ExternalLink className="w-5 h-5" />
                <span>Open in New Tab</span>
            </button>
        </div>
    )
}

export default EmbassyModalFooter