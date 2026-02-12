import React from 'react'
import { formatDateDDMMYY } from '../../../../util/dateFormat/dateFormatConvertion'

const EmbassyDocumentSection = ({ selectedDocument }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Embassy Name</p>
                    <p className="text-white font-semibold">{selectedDocument.country_name} Embassy</p>
                </div>
                {/* <div>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Country</p>
                    <p className="text-white font-semibold">{selectedDocument.country}</p>
                </div> */}
                <div>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Registration Date</p>
                    <p className="text-white font-semibold">{formatDateDDMMYY(selectedDocument?.created_at) ?? 'N/A'}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Document File</p>
                    <p className="text-white font-semibold">{selectedDocument?.document?.split('/')?.[selectedDocument?.document?.split('/')?.length - 1] ?? 'N/A'}</p>
                </div>
                {/* <div>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">File Size</p>
                    <p className="text-white font-semibold">{selectedDocument.documentSize}</p>
                </div> */}
                <div>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Status</p>
                    <p className={`capitalize font-bold ${selectedDocument?.is_approved === 'fulfilled' ? 'text-green-400' : selectedDocument?.is_approved === 'pending' ? 'text-yellow-400' : 'text-red-400'}`}>
                        {selectedDocument?.is_approved === 'fulfilled' ? 'Approved' : selectedDocument?.is_approved === 'pending' ? 'Pending' : 'Rejected'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default EmbassyDocumentSection