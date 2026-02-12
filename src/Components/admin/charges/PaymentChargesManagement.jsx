import React, { useEffect, useState } from 'react';
import { IndianRupee, Plus, AlertCircle, Loader2, Info } from 'lucide-react';
import ChargesRow from '../charges/payment/paymentCharges/ChargesRow';
import ChargesModal from '../charges/payment/paymentCharges/ChargesModal';
import { fetchCharges } from '../../../Redux/Slice/chargesSlice';
import getSweetAlert from '../../../util/alert/sweetAlert';
import { useDispatch, useSelector } from 'react-redux';

export default function PaymentChargesManagement({ SettingsSection, Modal }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isLoading] = useState(false);
  const dispatch = useDispatch();

  const { isChargesLoading, allCharges, hasChargesError } = useSelector(state => state?.charge);

  const handleOpenModal = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    dispatch(fetchCharges({ type: 'course' }))
      .then(res => {
        // console.log('Response for fetching all charges for course', res);
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }, []);

  // console.log('All available charges for course', allCharges?.course);

  return (
    <>
      <SettingsSection
        title="Payment Charges For Course"
        description="Manage additional charges and fees applied to payments"
        icon={IndianRupee}
      >
        {/* Add Button */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Info Notice - Fixed */}
          <div className="flex items-start gap-2 p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg flex-shrink-0 mb-4">
            <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-300">
              Course fee is managed separately. Set amount to 0% to mark tax/service as free.
            </p>
          </div>
          <button
            disabled={isLoading}
            onClick={handleOpenModal}
            className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed mb-4"
          >
            <Plus className="w-4 h-4" />
            Add New Charge
          </button>

          {/* List Section */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <h4 className="text-sm font-medium text-slate-300">Payment Charges</h4>
              {allCharges?.course?.length > 0 && (
                <span className="text-xs text-slate-400 bg-slate-700/30 px-2 py-0.5 rounded">
                  {allCharges?.course?.length} {allCharges?.course?.length === 1 ? 'charge' : 'charges'}
                </span>
              )}
            </div>

            {/* Fixed Height Scrollable Container */}
            <div className="h-[420px] overflow-hidden">
              {isChargesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                </div>
              ) : allCharges?.course?.length === 0 ? (
                <div className="flex items-start gap-2 p-3 bg-slate-700/20 border border-slate-600/30 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400">No payment charges configured yet</p>
                </div>
              ) : (
                <div className="h-full overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-500 glass-scrollbar">
                  {allCharges?.course?.map(charge => (
                    <ChargesRow key={charge.id} charge={charge} setEditingCourse={setEditingCourse} setIsModalOpen={setIsModalOpen} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Modal */}
      <ChargesModal Modal={Modal} charges={allCharges?.course} setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} editingCourse={editingCourse} />
    </>
  );
}