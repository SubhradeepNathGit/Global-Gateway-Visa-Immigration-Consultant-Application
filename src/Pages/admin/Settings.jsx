import React, { useEffect } from "react";
import GeneralSettings from "../../Components/admin/settings/GeneralSettings";
import AppearanceSettings from "../../Components/admin/settings/AppearanceSettings";
import HolidayManagement from "../../Components/admin/settings/HolidayManagement";

import { useDispatch, useSelector } from "react-redux";
import SettingsHeader from "../../Components/admin/settings/SettingsHeader";
import { checkLoggedInUser } from "../../Redux/Slice/auth/checkAuthSlice";
import getSweetAlert from "../../util/alert/sweetAlert";
import SettingsChargeBox from "../../Components/admin/common/settings-charge/SettingsChargeBox";
import AppointmentTopicManagement from "../../Components/admin/settings/AppointmentTopicManagement";
import SettingsChargeModal from "../../Components/admin/common/settings-charge/SettingsChargeModal";


// Form Field Component
function FormField({ label, id, type = "text", placeholder, value, onChange, helper, disabled }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} disabled={disabled}
          className="w-full px-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      {helper && <p className="mt-1 text-xs text-slate-400">{helper}</p>}
    </div>
  );
}

export default function Settings() {
  const dispatch = useDispatch();
  const { userAuthData, isUserLoading } = useSelector(state => state.checkAuth);

  useEffect(() => {
    dispatch(checkLoggedInUser()).catch(() => {
      getSweetAlert('Oops...', 'Something went wrong!', 'error');
    });
  }, [dispatch]);

  return (
    <div className="w-full space-y-6 ">
      {/* Header */}
      <SettingsHeader />

      {/* Top Row - Compact Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GeneralSettings SettingsSection={SettingsChargeBox} FormField={FormField} userAuthData={userAuthData} />

        <AppearanceSettings SettingsSection={SettingsChargeBox} userAuthData={userAuthData} />
      </div>


      {/* Bottom Row - Fixed Height Management Settings */}
      <div className="grid grid-cols-1  lg:grid-cols-2 gap-8">
        <HolidayManagement SettingsSection={SettingsChargeBox} />

        <AppointmentTopicManagement SettingsSection={SettingsChargeBox} Modal={SettingsChargeModal} />
      </div>

    </div>

  );
}