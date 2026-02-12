import React, { useState } from 'react'
import AdminCard from './AdminCard'
import AdminRow from './AdminRow'
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleUserStatus } from '../../../Redux/Slice/userSlice';
import hotToast from '../../../util/alert/hot-toast';
import { getAllAdmins } from '../../../Redux/Slice/adminSlice';
import { logoutUser } from '../../../Redux/Slice/auth/checkAuthSlice';
import { useNavigate } from 'react-router-dom';
import getSweetAlert from '../../../util/alert/sweetAlert';
import ConfirmBlockUnblockAlert from '../common/alerts/ConfirmBlockUnblockAlert';

const AdminTable = ({ filteredAdmins, isAdminLoading, setSuccessMessage, setShowSuccess }) => {

    const [alertModalOpen, setAlertModalOpen] = useState(false);
    const [setStatus, setSetStatus] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(false);
    const [selectedAdminId, setSelectedAdminId] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isuserLoading, userAuthData, userError } = useSelector(state => state.checkAuth);
    // console.log('Logged user data', userAuthData);

    const showSuccessNotification = (message, success) => {
        setSuccessMessage(message);
        setShowSuccess(success);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleUnblockBlockAdmin = (adminId, recentStatus) => {
        // console.log("change status of admin:", adminId, recentStatus);

        const status = !recentStatus ? 'blocked' : 'unblocked';

        setCurrentStatus(recentStatus);
        setSelectedAdminId(adminId);
        setSetStatus(status);
        setAlertModalOpen(true);
    }

    const confirmUnblockBlock = () => {
        // console.log("Unblock / Block admin:", selectedAdminId, setStatus);

        dispatch(toggleUserStatus({ id: selectedAdminId, currentStatus }))
            .then(res => {
                // console.log('Response for changing status', res);

                if (res?.meta?.requestStatus == "fulfilled") {
                    // hotToast(`Admin ${setStatus} successfully`, "success");

                    showSuccessNotification(`Admin ${setStatus} successfully`, true);
                    dispatch(getAllAdmins());
                    setAlertModalOpen(false);

                    if (userAuthData?.id == selectedAdminId && setStatus) {
                        dispatch(logoutUser({ user_type: 'admin', showAlert: true }));
                        navigate("/admin/");
                    }
                }
                else {
                    // hotToast(`Admin ${setStatus} unsuccessful`, "error");
                    showSuccessNotification(`Admin ${setStatus} unsuccessful`, false);
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    };

    return (
        <>
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-700/50">
                            <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Admin Name</th>
                            <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                            <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</th>
                            <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Verification</th>
                            <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Joining Date</th>
                            <th className="text-right p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isAdminLoading && (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center">
                                    <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
                                </td>
                            </tr>
                        )}
                        {!isAdminLoading && (!filteredAdmins || filteredAdmins.length === 0) && (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                                    No admins found matching your criteria
                                </td>
                            </tr>
                        )}
                        {!isAdminLoading && filteredAdmins?.length > 0 &&
                            filteredAdmins.map((admin, index) => (
                                <AdminRow
                                    key={admin.id}
                                    index={index}
                                    admin={admin}
                                    filteredAdmins={filteredAdmins}
                                    handleUnblockBlockAdmin={handleUnblockBlockAdmin}
                                />
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden divide-y divide-slate-700/30">
                {!isAdminLoading && filteredAdmins?.length > 0 &&
                    filteredAdmins.map((admin) => (
                        <AdminCard
                            key={admin.id}
                            admin={admin}
                            handleUnblockBlockAdmin={handleUnblockBlockAdmin}
                        />
                    ))}
            </div>

            <ConfirmBlockUnblockAlert
                open={alertModalOpen}
                onClose={() => setAlertModalOpen(false)}
                onConfirm={confirmUnblockBlock}
                buttonText={setStatus == 'blocked' ? 'Block' : 'Unblock'}
                type={setStatus == 'blocked' ? 'block' : 'unblock'}
                title={`${setStatus == 'blocked' ? 'Block' : 'Unblock'} Admin`}
                message={`Are you sure you want to ${setStatus == 'blocked' ? 'block' : 'unblock'} admin?`}
            />
        </>
    )


}

export default AdminTable
