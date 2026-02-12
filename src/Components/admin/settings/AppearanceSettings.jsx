import React, { useState } from 'react'
import { Palette, Moon, Sun, Monitor, KeyRound, Lock, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmBlockUnblockAlert from '../common/alerts/ConfirmBlockUnblockAlert';
import hotToast from '../../../util/alert/hot-toast';
import { toggleUserStatus } from '../../../Redux/Slice/userSlice';
import getSweetAlert from '../../../util/alert/sweetAlert';
import { logoutUser } from '../../../Redux/Slice/auth/checkAuthSlice';

const AppearanceSettings = ({ SettingsSection, userAuthData }) => {

    const [theme, setTheme] = useState("dark");
    const [alertModalOpen, setAlertModalOpen] = useState(false);
    const [setStatus, setSetStatus] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(false);
    const [selectedAdminId, setSelectedAdminId] = useState(null);

    const { isUserLoading } = useSelector(state => state.checkAuth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function formatToReadableDate(timestamp) {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    }

    const handleUnblockBlockAdmin = (adminId, recentStatus) => {
        // console.log("change status of admin:", adminId, recentStatus);

        const status = !recentStatus ? 'blocked' : 'unblocked';

        setCurrentStatus(recentStatus);
        setSelectedAdminId(adminId);
        setSetStatus(status);
        setAlertModalOpen(true);
    }

    const confirmUnblockBlock = () => {
        // console.log("Your account details:", selectedAdminId, setStatus);

        dispatch(toggleUserStatus({ id: selectedAdminId, currentStatus }))
            .then(res => {
                // console.log('Response for changing status', res);

                if (res?.meta?.requestStatus == "fulfilled") {

                    setAlertModalOpen(false);
                    dispatch({ user_type: 'admin', showAlert: true });
                    navigate("/admin/");
                    // hotToast(`Your account ${setStatus} successfully`, "success");
                }
                else {
                    hotToast(`Admin ${setStatus} unsuccessful`, "error");
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    };

    return (
        <SettingsSection
            title="Appearance & Account"
            description="Customize look and manage your account"
            icon={Palette}
        >
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                    Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => setTheme("light")}
                        className={`p-3 rounded-lg border transition-all ${theme === "light"
                            ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                            : "bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                            }`}
                    >
                        <Sun className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs">Light</div>
                    </button>
                    <button
                        onClick={() => setTheme("dark")}
                        className={`p-3 rounded-lg border transition-all ${theme === "dark"
                            ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                            : "bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                            }`}
                    >
                        <Moon className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs">Dark</div>
                    </button>
                    <button
                        onClick={() => setTheme("system")}
                        className={`p-3 rounded-lg border transition-all ${theme === "system"
                            ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                            : "bg-slate-700/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                            }`}
                    >
                        <Monitor className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs">System</div>
                    </button>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-700/50">
                <div className="text-sm font-medium text-slate-300 mb-3">Account Information</div>
                <div className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
                    <div className="text-sm font-medium text-white mb-1">Account Status</div>
                    <div className="text-xs text-slate-400">Active since {formatToReadableDate(userAuthData?.created_at)}</div>
                </div>
                <div className="space-y-2 mt-4">
                    <button className="w-full px-4 py-2.5 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 text-white text-sm transition-all flex items-center justify-center gap-2">
                        <KeyRound className="w-4 h-4" />
                        Change Passward
                    </button>
                    <button className="w-full px-4 py-2.5 rounded-lg bg-red-600/30 hover:bg-red-900 border border-red-500/30 text-white text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                        onClick={() => handleUnblockBlockAdmin(userAuthData?.id, userAuthData?.is_blocked)}>
                        {isUserLoading ? (
                            <div className="w-4 h-4 border-1 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) :
                            (<Lock className="w-4 h-4" />)
                        }
                        {isUserLoading ? 'Deactivating...' : 'Deactivate Account'}
                    </button>
                    {/* <button className="w-full px-4 py-2.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-500/30 text-white text-sm transition-all flex items-center justify-center gap-2">
                        <X className="w-4 h-4" />
                        Delete Account
                    </button> */}
                </div>
            </div>

            <ConfirmBlockUnblockAlert
                open={alertModalOpen}
                onClose={() => setAlertModalOpen(false)}
                onConfirm={confirmUnblockBlock}
                buttonText={setStatus == 'blocked' ? 'Deactivate' : 'Activate'}
                type={setStatus == 'blocked' ? 'block' : 'activate'}
                title={`${setStatus == 'blocked' ? 'Block' : 'Activate'} Admin`}
                message={`Are you sure you want to ${setStatus == 'blocked' ? 'deactivate' : 'activate'} your account?`}
            />
        </SettingsSection>
    )
}

export default AppearanceSettings