import React, { useState } from 'react'
import { Edit2, Lock, Trash2, Unlock } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { deleteVisaDetail, updateVisaDetail } from '../../../../../Redux/Slice/VisaDetailsSlice';
import hotToast from '../../../../../util/alert/hot-toast';
import { useQueryClient } from "@tanstack/react-query";
import getSweetAlert from '../../../../../util/alert/sweetAlert';
import { createPortal } from 'react-dom';
import ConfirmAlert from '../../../common/alerts/ConfirmAlert';

const VisaCardFooter = ({ handleEditVisa, visaDetails, visaData }) => {

    const [visaDetailsData, setVisaDetailsData] = useState(null);
    const [alertModalOpen, setAlertModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    const handleData = (details) => {
        setVisaDetailsData(details);
    }

    const handleConfirmAction = () => {
        if (confirmAction === "delete") {
            handleDeleteVisa(visaDetails);
            setAlertModalOpen(false);
            return;
        }

        handleBlockVisa();
    };

    const handleBlockVisa = () => {
        const policyObj = {
            ...visaDetails,
            status: visaDetails?.status === 'inactive' ? 'active' : 'inactive'
        }
        // console.log('policy', policyObj);

        if (policyObj?.status == 'active' && visaData?.status != 'active') {
            hotToast("This Visa type is inactive right now. Try again later", "error");
        }
        else {
            dispatch(updateVisaDetail({ id: visaDetails?.id, updatedData: policyObj }))
                .then(res => {
                    // console.log(`Response for updating policy details`, res);

                    if (res.meta.requestStatus === "fulfilled") {
                        hotToast(`Visa ${policyObj?.status !== 'active' ? 'blocked' : 'activated'} successfully`, "success");

                        setVisaDetailsData(null);
                        setAlertModalOpen(false);

                        queryClient.invalidateQueries({
                            queryKey: ["visaDetails"],
                        });
                        queryClient.invalidateQueries({ queryKey: ["countryWiseAllVisaPolicy"] });
                    } else {
                        getSweetAlert("Oops...", res.payload, "error");
                    }
                })
                .catch(() => {
                    getSweetAlert("Oops...", "Something went wrong!", "error");
                })
        }
    }

    const handleDeleteVisa = (visaDetails) => {
        dispatch(deleteVisaDetail(visaDetails?.id))
            .then(res => {
                // console.log(`Response for deleting policy details`, res);

                if (res.meta.requestStatus === "fulfilled") {
                    hotToast(`Visa deleted successfully`, "success");

                    setVisaDetailsData(null);
                    setAlertModalOpen(false);

                    queryClient.invalidateQueries({
                        queryKey: ["visaDetails"],
                    });
                    queryClient.invalidateQueries({ queryKey: ["countryWiseAllVisaPolicy"] });
                } else {
                    getSweetAlert("Oops...", res.payload, "error");
                }
            })
            .catch(() => {
                getSweetAlert("Oops...", "Something went wrong!", "error");
            })
    }

    return (
        <>
            <div className="flex gap-2 pt-2">
                <button
                    onClick={() => handleEditVisa(visaDetails)}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                    <Edit2 className="w-4 h-4" />
                    Edit
                </button>
                <button
                    onClick={() => { handleData(visaDetails); setConfirmAction(visaDetails?.status === "active" ? "block" : "active"); setAlertModalOpen(true) }}
                    className={`py-2 px-3 text-sm font-medium rounded-lg cursor-pointer transition-colors ${visaDetails?.status != "active"
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                >
                    {visaDetails?.status != "active" ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </button>
                <button
                    onClick={() => { handleData(visaDetails); setConfirmAction("delete"); setAlertModalOpen(true) }}
                    className="py-2 px-3 bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {alertModalOpen && createPortal(
                <ConfirmAlert
                    open={alertModalOpen}
                    onClose={() => { setAlertModalOpen(false); setConfirmAction(null); setVisaDetailsData(null); }}
                    onConfirm={handleConfirmAction}
                    buttonText={confirmAction === "delete"
                        ? "Delete" : confirmAction === "block" ? "Block" : "Activate"}
                    type={confirmAction}
                    title={confirmAction === "delete"
                        ? "Delete Visa" : `${confirmAction === "block" ? "Block" : "Activate"} Visa`}
                    message={confirmAction === "delete"
                        ? "Are you sure you want to permanently delete this visa?"
                        : `Are you sure you want to ${confirmAction} the visa?`}
                />,
                document.body)}
        </>
    )
}

export default VisaCardFooter