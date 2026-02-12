import React from 'react'
import { FileText } from 'lucide-react';
import EmbassyModalHeader from './EmbassyModalHeader';
import EmbassyModalFooter from './EmbassyModalFooter';
import EmbassyDocumentSection from './EmbassyDocumentSection';
import EmbassyContactSection from './EmbassyContactSection';

const EmbassyModal = ({ selectedDocument, setSelectedDocument }) => {

    const isPdf = selectedDocument?.document?.endsWith('.pdf');

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800/95 backdrop-blur-xl rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden border border-slate-600/50 shadow-2xl">

                <EmbassyModalHeader selectedDocument={selectedDocument} setSelectedDocument={setSelectedDocument} />

                <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
                    <div className="bg-slate-700/30 rounded-lg p-4 mb-6 border border-slate-600/50">
                        {isPdf ? (
                            <iframe
                                src={selectedDocument.document}
                                className="w-full h-[600px] rounded-lg"
                                title="PDF Preview"
                            />
                        ) : (
                            <img
                                src={selectedDocument.document}
                                alt={selectedDocument?.country_name}
                                className="w-full h-auto rounded-lg"
                                onError={(e) => {
                                    e.currentTarget.src =
                                        'https://via.placeholder.com/800x600?text=Document+Preview';
                                }}
                            />
                        )}
                    </div>

                    <div className="bg-slate-700/30 backdrop-blur-sm rounded-lg p-6 border border-slate-600/50 mb-6">
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-400" />
                            Document Information
                        </h4>

                        <EmbassyDocumentSection selectedDocument={selectedDocument} />
                        <EmbassyContactSection selectedDocument={selectedDocument} />

                        {selectedDocument.verificationNotes && (
                            <div className="mt-6 pt-6 border-t border-slate-600/50">
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Verification Notes</p>
                                <p className="text-slate-300 text-sm">{selectedDocument.verificationNotes}</p>
                            </div>
                        )}
                    </div>

                    <EmbassyModalFooter selectedDocument={selectedDocument} />
                </div>
            </div>
        </div>
    )
}

export default EmbassyModal