import React, { useState, useEffect } from "react";
import { DollarSign, Info, Plus, Loader2 } from "lucide-react";
import PaymentRow from "../charges/payment/additionalPayment/PaymentRow";
import PaymentModal from "../charges/payment/additionalPayment/PaymentModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchCharges } from "../../../Redux/Slice/chargesSlice";
import getSweetAlert from "../../../util/alert/sweetAlert";

export default function AdditionalPaymentManagement({ SettingsSection }) {
  const dispatch = useDispatch();

  const [editingId, setEditingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { isChargesLoading, allCharges, hasChargesError } = useSelector(state => state?.charge);

  useEffect(() => {
    dispatch(fetchCharges({ type: 'visa' }))
      .then(res => {
        // console.log('Response for fetching all charges for visa', res);
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }, []);

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const totalAdditional = allCharges?.visa?.reduce((sum, charge) => sum + Number(charge.amount || 0), 0);

  // console.log('All available charges for visa', allCharges?.visa);

  if (isChargesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <SettingsSection
            title="Additional Payment Management"
            description="Configure additional visa service charges"
            icon={DollarSign}
          >
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
          </SettingsSection>
        </div>
      </div>
    );
  }

  return (
    <>
      <SettingsSection
        title="Additional Payment Management For VISA"
        description="Configure additional visa service charges"
        icon={DollarSign}
      >
        {/* Container with fixed height - matching Holiday Management */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Info Notice - Fixed */}
          <div className="flex items-start gap-2 p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg flex-shrink-0 mb-4">
            <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-300">
              Application fee is managed separately. Set amount to ₹0 to mark tax/service as free.
            </p>
          </div>

          {/* Add New Charge Button - Fixed */}
          <button
            onClick={openAddModal}
            disabled={isChargesLoading}
            className="w-full px-4 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed flex-shrink-0 mb-4"
          >
            <Plus className="w-4 h-4" />
            Add New Charge
          </button>

          {/* Charges List Section - Flexible */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <h4 className="text-sm font-medium text-slate-300">Payment Charges</h4>
              {allCharges?.visa?.length > 0 && (
                <span className="text-xs text-slate-400 bg-slate-700/30 px-2 py-0.5 rounded">
                  {allCharges?.visa?.length} {allCharges?.visa?.length === 1 ? 'charge' : 'charges'}
                </span>
              )}
            </div>

            {/* Scrollable Charges List */}
            <div className="h-[420px] overflow-hidden">
              {isChargesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                </div>
              ) : allCharges?.visa?.length === 0 ? (
                <div className="flex items-start gap-2 p-3 bg-slate-700/20 border border-slate-600/30 rounded-lg">
                  <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400">No charges configured. Add your first charge to get started.</p>
                </div>
              ) : (
                <div className="h-full overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-500 glass-scrollbar">
                  {allCharges?.visa?.map(charge => (
                    <PaymentRow key={charge.id} charge={charge} editingId={editingId} setEditingId={setEditingId} isSaving={isChargesLoading} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Total Summary - Fixed at Bottom */}
          {allCharges?.visa?.length > 0 && (
            <div className="p-3 bg-slate-700/20 border border-slate-600/30 rounded-lg flex-shrink-0 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Total Additional Charges</span>
                <span className="text-xl font-bold text-white">
                  ₹{totalAdditional?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}
        </div>
      </SettingsSection>

      {/* Add Charge Modal */}
      <PaymentModal showAddModal={showAddModal} setShowAddModal={setShowAddModal} charges={allCharges?.visa} />

    </>
  );
}