import React from "react";
import AdditionalPaymentManagement from "../../Components/admin/charges/AdditionalPaymentManagement";
import PromoCodeManagement from "../../Components/admin/charges/PromoCodeManagement";
import PaymentChargesManagement from "../../Components/admin/charges/PaymentChargesManagement";
import ChargesHeader from "../../Components/admin/charges/ChargesHeader";
import SettingsChargeBox from "../../Components/admin/common/settings-charge/SettingsChargeBox";
import SettingsChargeModal from "../../Components/admin/common/settings-charge/SettingsChargeModal";

export default function ManageCharges() {
  return (
    <div className="w-full space-y-6 ">
      {/* Header */}
      <ChargesHeader />

      {/* Payment Settings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       <AdditionalPaymentManagement SettingsSection={SettingsChargeBox}/>

        <PaymentChargesManagement SettingsSection={SettingsChargeBox} Modal={SettingsChargeModal}/>
      </div>

      {/* Bottom Row - Discount Management Settings */}
      <div className="grid grid-cols-1  lg:grid-cols-2 gap-8">
        <PromoCodeManagement SettingsSection={SettingsChargeBox} Modal={SettingsChargeModal} />

      </div>

    </div>
  );
}