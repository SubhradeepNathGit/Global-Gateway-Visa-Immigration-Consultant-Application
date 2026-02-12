import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import hotToast from '../../../../../util/alert/hot-toast';
import getSweetAlert from '../../../../../util/alert/sweetAlert';
import { useDispatch } from 'react-redux';
import { deleteVisaTypeFromCountry } from '../../../../../Redux/Slice/visaSlice';
import { useQueryClient } from "@tanstack/react-query";
import ConfirmAlert from '../../../common/alerts/ConfirmAlert';
import { createPortal } from 'react-dom';

const VisaCardConfigBtn = ({ handleEditVisa, visaType, visaData, country_id }) => {

    const [visaId, setVisaId] = useState(null);
    const [alertModalOpen, setAlertModalOpen] = useState(false);

    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const handleVisaTypeData = (id) => {
        setVisaId(id);
    }

    const handleDeleteVisaType = async () => {

        try {
            dispatch(deleteVisaTypeFromCountry({ visaId, countryVisaRowId: visaData?.id }))
                .then(res => {
                    // console.log('Response for deleting visa type', res);

                    if (res?.meta?.requestStatus == "fulfilled") {

                        hotToast("Visa type deleted successfully", "success");

                        setAlertModalOpen(false);
                        setVisaId(null);

                        queryClient.invalidateQueries({
                            queryKey: ["countryVisa", country_id],
                        });
                        queryClient.invalidateQueries({ queryKey: ["visaList"] });
                        queryClient.invalidateQueries({ queryKey: ["visa-enable-country", country_id] });
                    }
                    else {
                        getSweetAlert('Oops...', 'Something went wrong!', 'error');
                    }
                })
                .catch(err => {
                    console.log('Error occured', err);
                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                })
        } catch (err) {
            getSweetAlert('Oops...', 'Something went wrong!', 'error');
        }
    };

    return (
        <>
            <div className="space-y-2">
                <button
                    onClick={() => handleEditVisa(Object.keys(visaType)[0])}
                    className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Configure Policy
                </button>
                <button
                    onClick={() => { handleVisaTypeData(Object.keys(visaType)[0]); setAlertModalOpen(true); }}
                    className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                    <Trash2 className="w-4 h-4" />
                    Remove Visa Type
                </button>
            </div>

            {alertModalOpen && createPortal(
                <ConfirmAlert
                    open={alertModalOpen}
                    onClose={() => setAlertModalOpen(false)}
                    onConfirm={handleDeleteVisaType}
                    buttonText={'Delete'}
                    type={'delete'}
                    title={`Delete Visa Type`}
                    message={`Are you sure you want to delete the visa type?`}
                />,
                document.body)}
        </>
    )
}

export default VisaCardConfigBtn