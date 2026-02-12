import React from "react";
import { CheckCircle2, Download, Eye, FileText, Hourglass, Shield, XCircle } from "lucide-react";

const getFileType = (url) =>
    url ? url.split(".").pop()?.toUpperCase() : "N/A";

const openDoc = (url) => {
    if (!url) return;
    window.open(url, "_blank");
};

const downloadDoc = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
};

const Documents = ({ application }) => {
    const appDocs = application?.application_documents;
    const visaDocs = application?.application_visa_details;

    // Primary documents 
    const documents = [
        {
            name: "Passport Copy",
            path: appDocs?.passport_path,
        },
        {
            name: "Photograph",
            path: appDocs?.photo_path,
        },
        {
            name: "Bank Statement",
            path: appDocs?.bank_statement_path,
        },
    ].filter(doc => doc.path);

    // Additional documents 
    const additionalDocuments = visaDocs
        ? Array.from({ length: 5 }, (_, i) => {
            const index = i + 1;
            return {
                name: `Additional Document ${index}`,
                path: visaDocs[`document${index}_path`],
            };
        }).filter(doc => doc.path)
        : [];

    const renderDocCard = (doc, idx) => (
        <div
            key={idx}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText size={24} className="text-blue-600" />
                </div>
                <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-600">
                        {getFileType(doc.path)}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span className={`px-3 py-2 rounded-full text-xs font-medium ${(application?.status == 'pending' || application?.status == 'processing') ?'bg-yellow-100 text-yellow-700':application?.status == 'approved'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>
                    {application?.status == 'pending' || application?.status == 'processing' ? (<><Hourglass className="inline h-3 mb-1" />Pending</>) : application?.status == 'approved' ? (<><CheckCircle2 className="inline h-3 mb-1" /> Verified</>) : (<><XCircle className="inline h-3 mb-1" /> Unverified</>)}
                </span>

                <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    onClick={() => openDoc(doc.path)}
                >
                    <Eye size={18} className="text-gray-600" />
                </button>
                <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    onClick={() => downloadDoc(doc.path)}
                >
                    <Download size={18} className="text-gray-600" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield size={20} className="text-blue-600" />
                Uploaded Documents
            </h3>

            {documents.map(renderDocCard)}

            {additionalDocuments.length > 0 && (
                <>
                    <h4 className="text-md font-semibold text-gray-700 mt-6">
                        Additional Documents
                    </h4>
                    {additionalDocuments.map(renderDocCard)}
                </>
            )}
        </div>
    );
};

export default Documents;
