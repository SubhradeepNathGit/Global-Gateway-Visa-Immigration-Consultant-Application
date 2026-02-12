import React from 'react'
import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { formatDateDDMMYY } from '../../../../../../util/dateFormat/dateFormatConvertion';
import { encodeBase64Url } from '../../../../../../util/encodeDecode/base64';

const ApplicationTableRow = ({ app }) => {

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
        <tr className="hover:bg-gray-50/50 transition-colors">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{app?.id?.length > 10 ? app?.id?.slice(0, 11) + '...' : app?.id ?? 'N/A'}</td>
            <td className="px-6 py-4">
                <div>
                    <p className="text-sm font-medium text-gray-900">{fullName.length > 10 ? fullName.slice(0, 11) + '...' : fullName ?? 'N/A'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{app?.application_personal_info?.country ?? 'N/A'}</p>
                </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">{app?.application_visa_details?.visa_type ?? 'N/A'}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{formatDateDDMMYY(app?.applied_at) ?? 'N/A'}</td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(app?.status)}`}>
                    {app?.status?.charAt(0)?.toUpperCase() + app?.status?.slice(1)}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <button
                    onClick={() => navigate(`/embassy/dashboard/applications/${encodeBase64Url(String(app?.id))}`)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                >
                    <Eye size={18} />
                </button>
            </td>
        </tr>
    )
}

export default ApplicationTableRow