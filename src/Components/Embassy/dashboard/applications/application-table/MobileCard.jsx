import React from 'react'
import { useNavigate } from 'react-router-dom'
import GetStatusBadge from './GetStatusBadge';
import { Eye } from 'lucide-react';
import { formatDateDDMMYY } from '../../../../../util/dateFormat/dateFormatConvertion';
import { encodeBase64Url } from '../../../../../util/encodeDecode/base64';

const MobileCard = ({ app }) => {

    const navigate = useNavigate();
    const fullName = app?.application_personal_info?.first_name + " " + app?.application_personal_info?.last_name;

    const getStatusBadge = (status) => {
        const styles = {
            pending: "bg-yellow-100 text-orange-400 border border-yellow-200",
            processing: "bg-yellow-50 text-yellow-700 border border-yellow-200",
            review: "bg-blue-50 text-blue-700 border border-blue-200",
            approved: "bg-green-50 text-green-700 border border-green-200",
            rejected: "bg-red-50 text-red-700 border border-red-200"
        };
        return styles[status] || styles.pending;
    };

    return (
        <div className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="text-sm font-medium text-blue-600">{app?.id ?? 'N/A'}</p>
                    <p className="text-base font-semibold text-gray-900 mt-1">{fullName ?? 'N/A'}</p>
                    <p className="text-xs text-gray-500">{app?.application_personal_info?.email ?? 'N/A'}</p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Visa Type:</span>
                    <span className="text-sm font-medium text-gray-900">{app?.application_visa_details?.visa_type ?? 'N/A'}</span>
                </div>
                <div className='flex items-center justify-between'>
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(app?.status)}`}>{app?.status?.charAt(0)?.toUpperCase() + app?.status?.slice(1)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Submitted:</span>
                    <span className="text-sm text-gray-900">{formatDateDDMMYY(app?.applied_at) ?? 'N/A'}</span>
                </div>
            </div>

            <div className="flex gap-2 mt-4">
                <button
                    onClick={() => navigate(`/embassy/dashboard/applications/${encodeBase64Url(String(app?.id))}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Eye size={16} />
                    View Details
                </button>
            </div>
        </div>
    )
}

export default MobileCard