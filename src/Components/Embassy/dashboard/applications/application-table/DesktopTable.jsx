import React from 'react'
import { Calendar, Eye, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatDateDDMMYY } from '../../../../../util/dateFormat/dateFormatConvertion'
import { encodeBase64Url } from '../../../../../util/encodeDecode/base64'

const DesktopTable = ({ app }) => {

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
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-blue-600">{app?.id?.length > 15 ? app?.id?.slice(0, 16) + '...' : app?.id ?? 'N/A'}</span>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <User size={18} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">{fullName?.length > 15 ? fullName?.slice(0, 16) + '...' : fullName ?? 'N/A'}</p>
                        <p className="text-xs text-gray-500">{app?.application_personal_info?.email?.length > 18 ? app?.application_personal_info?.email?.slice(0, 19) + '...' : app?.application_personal_info?.email ?? 'N/A'}</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">{app?.application_visa_details?.visa_type ?? 'N/A'}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">{app?.application_personal_info?.country ?? 'N/A'}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(app?.status)}`}>{app?.status?.charAt(0)?.toUpperCase() + app?.status?.slice(1)}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={14} />
                    {formatDateDDMMYY(app?.applied_at) ?? 'N/A'}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => navigate(`/embassy/dashboard/applications/${encodeBase64Url(String(app?.id))}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                    >
                        <Eye size={18} />
                    </button>
                    {/* <button
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="More Options"
                    >
                        <MoreVertical size={18} />
                    </button> */}
                </div>
            </td>
        </tr>
    )
}

export default DesktopTable