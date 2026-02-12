import React, { useState } from 'react'
import { Ban, ChevronDown, ChevronRight, Eye, Globe, ShieldCheck } from 'lucide-react';
import EmbassyExpanded from './EmbassyExpanded';
import { formatDateDDMMYY } from '../../../util/dateFormat/dateFormatConvertion';
import { useDispatch } from 'react-redux';
import { fetchAllEmbassy, updateEmbassyStatus } from '../../../Redux/Slice/embassySlice';
import hotToast from '../../../util/alert/hot-toast';
import getSweetAlert from '../../../util/alert/sweetAlert';
import ConfirmBlockUnblockAlert from '../common/alerts/ConfirmBlockUnblockAlert';
import { createPortal } from 'react-dom';

const EmbassyRow = ({ embassy, expandedEmbassies, setExpandedEmbassies, setSelectedDocument }) => {
    const [status, setstatus] = useState(null);
    const [currentEmbassy, setCurrentEmbassy] = useState(null);
    const [alertModalOpen, setAlertModalOpen] = useState(false);
    const dispatch = useDispatch();

    const toggleBlockUnblock = () => {
        dispatch(updateEmbassyStatus({ id: currentEmbassy?.id, status: currentEmbassy?.is_approved, is_blocked: status, is_country_listed: currentEmbassy?.is_country_listed }))
            .then(res => {
                // console.log('Response from embassy status', res);

                if (res?.meta?.requestStatus == "fulfilled") {

                    hotToast(`Embassy ${status ? 'blocked' : 'unblocked'} successfully`, "success");
                    dispatch(fetchAllEmbassy());
                    setAlertModalOpen(false);
                    setstatus(null);
                    setCurrentEmbassy(null);
                }
                else {
                    hotToast(`Embassy ${status ? 'blocked' : 'unblocked'} unsuccessfull`, "error");
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    }

    const getStatusColor = (status) => {
        const colors = {
            fulfilled: 'px-2 py-3 bg-green-500/20 text-green-400',
            success: 'px-3 py-3 bg-green-500/20 text-green-400',
            pending: 'px-3 py-3 bg-yellow-500/20 text-yellow-400',
            processing: 'px-1.5 py-3 bg-blue-500/20 text-blue-400',
            rejected: 'px-3 py-3 bg-red-500/20 text-red-400',
            failure: 'px-4.5 py-3 bg-red-500/20 text-red-400',
            false: 'px-3 py-3 bg-green-500/20 text-green-400',
            true: 'px-3.5 py-3 bg-red-500/20 text-red-400',
        }

        return colors[status] || 'px-4.5 py-3 bg-gray-500/20 text-gray-400';
    };

    const getStatusContent = (status) => {
        const content = {
            fulfilled: 'Approved',
            pending: 'Pending',
            processing: 'Processing',
            rejected: 'Rejected',
            success: 'Success',
            failure: 'Failed',
            false: 'Active',
            true: 'Block',
        }
        return content[status] || 'N/A';
    };

    const ActionButton = ({ onClick, icon: Icon, color, title, disable = false }) => (
        <button
            onClick={onClick} disabled={disable}
            className={`p-2 ${!disable ? `text-${color}-400 hover:bg-${color}-500/20 cursor-pointer` : 'text-gray-400 hover:bg-gray-500/20 cursor-not-allowed'} rounded-lg transition-colors`}
            title={title}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    const handleEmbassyData = (embassy, status) => {
        setCurrentEmbassy(embassy);
        setstatus(status);
    }

    const embassyName = embassy?.country_name + " Embassy";

    return (
        <>
            <tr className="border-b border-slate-600/50 hover:bg-slate-700/30 transition-colors">
                <td className="px-6 py-4">
                    <button
                        onClick={() => setExpandedEmbassies(prev => ({ ...prev, [embassy?.id]: !prev[embassy?.id] }))}
                        className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                        {expandedEmbassies[embassy.id] ?
                            <ChevronDown className="w-5 h-5" /> :
                            <ChevronRight className="w-5 h-5" />
                        }
                    </button>
                </td>

                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{embassy?.country_name?.charAt(0)?.toUpperCase()}E</span>
                        <div>
                            <div className="text-white font-medium flex items-center gap-2">
                                {embassyName?.length > 16 ? embassyName?.slice(0, 15) + '...' : embassyName ?? 'N/A'}
                                {/* {embassy?.is_blocked && (
                                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-medium rounded flex items-center gap-1 border border-red-500/30">
                                        <Ban className="w-3 h-3" />
                                        Blocked
                                    </span>
                                )} */}
                                {!embassy?.is_country_listed && (
                                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-medium rounded flex items-center gap-1 border border-blue-500/30">
                                        <Globe className="w-3 h-3" />
                                        New Country
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-slate-500">{embassy?.country_name ?? 'N/A'}</div>
                        </div>
                    </div>
                </td>

                <td className="px-6 py-4 text-slate-300 text-sm">{embassy?.email?.length > 20 ? embassy?.email?.slice(0, 20) + '...' : embassy?.email ?? 'N/A'}</td>
                <td className={`px-6 py-4 text-slate-300 text-sm `}>
                    <span className={`inline-block rounded text-xs font-medium capitalize ${getStatusColor(embassy?.is_verified)}`}>
                        {getStatusContent(embassy?.is_verified) ?? 'N/A'}
                    </span>
                </td>
                <td className="px-6 py-4 text-slate-300 text-sm">{formatDateDDMMYY(embassy?.created_at) ?? 'N/A'}</td>

                <td className="px-6 py-4">
                    <span className={`inline-block rounded text-xs font-medium capitalize ${getStatusColor(embassy?.starting_hours && embassy?.country_id ? embassy?.is_approved : 'processing')}`}>
                        {getStatusContent(embassy?.starting_hours && embassy?.country_id ? embassy?.is_approved : 'processing')}
                    </span>
                </td>
                <td className="px-6 py-4">
                    <span className={`inline-block rounded text-xs font-medium capitalize ${getStatusColor(embassy?.is_approved == 'fulfilled' ? !!embassy?.is_blocked : '')}`}>
                        {getStatusContent(embassy?.is_approved == 'fulfilled' ? !!embassy?.is_blocked : '')}
                    </span>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <ActionButton onClick={() => setSelectedDocument(embassy)} icon={Eye} color="blue" title="View Document" disable={embassy?.starting_hours && embassy?.country_id ? false : true} />

                        {embassy?.is_blocked ?
                            <ActionButton onClick={() => {handleEmbassyData(embassy, false); setAlertModalOpen(true);}} icon={ShieldCheck} color="green" title="Unblock" disable={embassy?.starting_hours && embassy?.is_approved == 'fulfilled' ? false : true} /> :
                            <ActionButton onClick={() => {handleEmbassyData(embassy, true); setAlertModalOpen(true);}} icon={Ban} color="red" title="Block" disable={embassy?.starting_hours && embassy?.is_approved == 'fulfilled' ? false : true} />
                        }
                    </div>
                </td>
            </tr>

            {expandedEmbassies[embassy.id] && (
                <EmbassyExpanded embassy={embassy} />
            )}

            {alertModalOpen && createPortal(
                <ConfirmBlockUnblockAlert
                    open={alertModalOpen}
                    onClose={() => setAlertModalOpen(false)}
                    onConfirm={toggleBlockUnblock}
                    buttonText={!embassy?.is_blocked ? 'Block' : 'Active'}
                    type={!embassy?.is_blocked ? 'block' : 'active'}
                    title={`${!embassy?.is_blocked ? 'Block' : 'Active'} Embassy`}
                    message={`Are you sure you want to ${!embassy?.is_blocked ? 'block' : 'active'} the embassy?`}
                />,
                document.body)}
        </>
    )
}

export default EmbassyRow