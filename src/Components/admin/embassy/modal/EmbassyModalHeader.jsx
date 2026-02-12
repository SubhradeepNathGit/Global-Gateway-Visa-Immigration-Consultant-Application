import React from 'react'
import { Check, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEmbassy, updateEmbassyStatus } from '../../../../Redux/Slice/embassySlice';
import hotToast from '../../../../util/alert/hot-toast';
import getSweetAlert from '../../../../util/alert/sweetAlert';

const EmbassyModalHeader = ({ selectedDocument, setSelectedDocument }) => {

    const dispatch = useDispatch();
    const { isEmbassyLoading, allEmbassyData: embassyData, hasEmbassyerror } = useSelector(state => state?.embassy);

    const approveEmbassy = (embassyData, status) => {
        // console.log('Received embassy data', embassyData, status);

        if (!embassyData?.is_country_listed) {
            getSweetAlert('Oops...', 'Add the related country first to update status', 'info');
        }
        else {
            dispatch(updateEmbassyStatus({ id: embassyData?.id, status, is_blocked: embassyData?.is_blocked, is_country_listed: embassyData?.is_country_listed }))
                .then(res => {
                    // console.log('Response from embassy status', res);

                    if (res?.meta?.requestStatus == "fulfilled") {

                        hotToast(`Embassy ${status == 'fulfilled' ? 'approved' : 'rejected'} successfully`, "success");
                        dispatch(fetchAllEmbassy());
                        setSelectedDocument(null);
                    }
                    else {
                        hotToast(`Embassy ${status == 'fulfilled' ? 'approval' : 'rejection'} unsuccessfull`, "error");
                    }
                })
                .catch(err => {
                    console.log('Error occured', err);
                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                })
        }
    }
    return (
        <div className="p-6 border-b border-slate-600/50 flex items-center justify-between bg-slate-800/70">
            <div>
                <h3 className="text-2xl font-bold text-white">Document Preview</h3>
                <p className="text-slate-400 text-sm mt-0.5">{selectedDocument?.country_name}</p>
            </div>

            <div className="flex items-center gap-3">
                {selectedDocument?.starting_hours && selectedDocument?.country_id && selectedDocument?.is_approved == 'pending' && (
                    <>
                        <button
                            onClick={() => { approveEmbassy(selectedDocument, "fulfilled") }}
                            className={`flex items-center gap-2 px-6 py-2.5 text-green-400 rounded-lg transition-all duration-200 font-semibold border border-green-500/40 ${isEmbassyLoading ? 'bg-green-500/30 cursor-not-allowed' : 'bg-green-500/20 hover:bg-green-500/30 cursor-pointer'}`}
                        >
                            <Check className="w-5 h-5" />
                            Approve
                        </button>

                        <button
                            onClick={() => { approveEmbassy(selectedDocument, "rejected") }}
                            className={`flex items-center gap-2 px-6 py-2.5 text-red-400 rounded-lg transition-all duration-200 font-semibold border border-red-500/40 ${isEmbassyLoading ? 'bg-red-500/30 cursor-not-allowed' : 'bg-red-500/20 hover:bg-red-500/30 cursor-pointer'}`}
                        >
                            <X className="w-5 h-5" />
                            Reject
                        </button>
                    </>
                )}

                <button
                    onClick={() => setSelectedDocument(null)}
                    className="p-2.5 hover:bg-slate-700/50 rounded-lg transition-all cursor-pointer"
                >
                    <X className="w-6 h-6 text-slate-400 hover:text-white" />
                </button>
            </div>
        </div>
    )
}

export default EmbassyModalHeader