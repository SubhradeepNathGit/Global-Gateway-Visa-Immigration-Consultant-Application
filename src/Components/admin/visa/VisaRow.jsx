import React, { useState } from 'react'
import { Calendar, ChevronDown, ChevronRight, Clock, Lock, Unlock } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { updateVisa } from '../../../Redux/Slice/visaSlice';
import hotToast from '../../../util/alert/hot-toast';
import getSweetAlert from '../../../util/alert/sweetAlert';
import { useAverageProcessingTime } from '../../../tanstack/query/getAvgVisaProcessingTime';
import { useAverageValidity } from '../../../tanstack/query/getAvgVisaValidity';
import { useVisaDetailsByVisaId } from '../../../tanstack/query/getVisaDetailsByVisaId';
import { useVisaWiseApplicationViaVisaId } from '../../../tanstack/query/getVisaWiseApplicationViaVisaId';
import ConfirmBlockUnblockAlert from '../common/alerts/ConfirmBlockUnblockAlert';
import { createPortal } from 'react-dom';
import { addNotification } from '../../../Redux/Slice/notificationSlice';

const VisaRow = ({ expandedVisa, setExpandedVisa, visa }) => {
    const dispatch = useDispatch();

    const [visaId, setVisaId] = useState(null);
    const [currentVisa, setCurrentVisa] = useState(null);
    const [alertModalOpen, setAlertModalOpen] = useState(false);

    const { data: avgProcessingTime, isLoading: processingTimeLoading } = useAverageProcessingTime(visa?.id);
    const { data: avgValidity, isLoading: validityLoading } = useAverageValidity(visa?.id);
    const { data: visaCountryList, isLoading: isVisaCountryLoading, isError, error: visaCountryListError } = useVisaDetailsByVisaId(visa?.id);
    const { data: applicationList, isLoading: isApplicationListLoading, error: applicationListError } = useVisaWiseApplicationViaVisaId({ visaId: visa?.id, applicationStatus: 'all' });

    // console.log(applicationList);
    // console.log(visaCountryList);

    const countryIds = visaCountryList?.map(item => item.country_id) || [];
    const uniqueCountryIds = [...new Set(countryIds)];

    const visaName = visa?.visa_type?.split(" ")?.map(type => type?.charAt(0)?.toUpperCase() + type?.slice(1)?.toLowerCase())?.join(" ");

    const toggleVisaStatus = () => {
        const updated_visa = {
            ...currentVisa,
            status: currentVisa?.status == 'active' ? 'inactive' : 'active'
        }

        dispatch(updateVisa({ id: visaId, updatedData: updated_visa }))
            .then(res => {
                // console.log('Response for updating status', res);

                if (res?.meta?.requestStatus == "fulfilled") {

                    const notification_obj = {
                        application_id: null,
                        title: `${visaName} is ${updated_visa.status != 'active' ? 'not' : ''} available right now`,
                        receiver_type: 'embassy',
                        receiver_country_id: uniqueCountryIds,
                        mark_read: false
                    }

                    dispatch(addNotification(notification_obj))
                        .then(res => {
                            // console.log('Response for adding notification', res);

                            if (res?.meta?.requestStatus == "fulfilled") {
                                hotToast(`Visa ${updated_visa?.status == 'active' ? 'activated' : 'de-activated'} successfully`, "success");
                                setAlertModalOpen(false);
                                setVisaId(null);
                                setCurrentVisa(null);
                            }
                            else {
                                getSweetAlert('Oops...', 'Something went wrong!', 'error');
                            }
                        })
                        .catch(err => {
                            console.log('Error occured', err);
                            getSweetAlert('Oops...', 'Something went wrong!', 'error');
                        })
                }
                else {
                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    }

    const handleVisaData = (id, visa) => {
        setVisaId(id);
        setCurrentVisa(visa);
    }

    const getBlockedCountries = (visa) => {
        const blocked = visa?.countryStatus?.filter(c => c.status === 'blocked').map(c => c.country);
        return blocked?.length > 0 ? blocked?.join(', ') : 'Open';
    }

    return (
        <>
            <tr className="border-b border-slate-600/30 hover:bg-slate-700/20 transition-colors">
                <td className="px-4 py-4">
                    <button
                        onClick={() => setExpandedVisa(expandedVisa === visa.id ? null : visa.id)}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        {expandedVisa === visa.id ? (
                            <ChevronDown className="w-5 h-5 cursor-pointer" />
                        ) : (
                            <ChevronRight className="w-5 h-5 cursor-pointer" />
                        )}
                    </button>
                </td>
                <td className="px-4 py-4">
                    <div className="font-semibold text-white text-sm">{visaName}</div>
                </td>
                <td className="px-4 py-4 text-slate-300 text-sm hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        {processingTimeLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : avgProcessingTime}
                    </div>
                </td>
                <td className="px-4 py-4 text-slate-300 text-sm hidden xl:table-cell">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {validityLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : avgValidity}
                    </div>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="text-white font-semibold text-sm text-center">
                        {isApplicationListLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : applicationList?.length}

                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="flex justify-center">
                        {visa?.status === 'active' ? (
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium whitespace-nowrap">
                                <Unlock className="w-3 h-3" />
                                Active
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-medium whitespace-nowrap">
                                <Lock className="w-3 h-3" />
                                In-active
                            </span>
                        )}
                    </div>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="text-white font-semibold text-sm text-center">
                        {isVisaCountryLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : visaCountryList?.length}
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="flex justify-center">
                        <button
                            onClick={() => {
                                handleVisaData(visa?.id, visa);
                                setAlertModalOpen(true);
                            }}
                            className={`p-2 hover:bg-slate-700/30 rounded-lg transition-colors cursor-pointer ${visa?.status === 'active' ? 'text-red-400 hover:text-red-300' : 'text-emerald-400 hover:text-emerald-300'
                                }`}
                            title={visa?.status === 'active' ? 'Block Visa Globally' : 'Activate Visa Globally'}
                        >
                            {visa?.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>
                    </div>
                </td>
            </tr >

            {alertModalOpen && createPortal(
                <ConfirmBlockUnblockAlert
                    open={alertModalOpen}
                    onClose={() => setAlertModalOpen(false)}
                    onConfirm={toggleVisaStatus}
                    buttonText={currentVisa?.status == 'active' ? 'Block' : 'Active'}
                    type={currentVisa?.status != 'inactive' ? 'block' : 'active'}
                    title={`${currentVisa?.status != 'inactive' ? 'Block' : 'Active'} Visa Globally`}
                    message={`Are you sure you want to ${currentVisa?.status != 'inactive' ? 'block' : 'active'} the visa?`}
                />,
                document.body)}
        </>
    )
}

export default VisaRow