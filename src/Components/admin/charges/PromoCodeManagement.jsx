import React, { useEffect, useState } from 'react';
import { Tag, Plus, AlertCircle, Loader2 } from 'lucide-react';
import PromocodeRow from '../charges/payment/promocode/PromocodeRow';
import PromocodeModal from '../charges/payment/promocode/PromocodeModal';
import { fetchCodes } from '../../../Redux/Slice/promocodeSlice';
import getSweetAlert from '../../../util/alert/sweetAlert';
import { useDispatch, useSelector } from 'react-redux';

export default function PromoCodeManagement({ SettingsSection, Modal }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState(null);
  const [isLoading] = useState(false);
  const dispatch = useDispatch();

  const { isCodeLoading, allCode: promoCodes, hasCodesError } = useSelector(state => state?.promocode);

  const handleOpenModal = () => {
    setEditingPromoCode(null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    dispatch(fetchCodes())
      .then(res => {
        // console.log('Response for fetching all codes', res);
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }, []);

  // console.log('All available Promocodes', promoCodes);

  return (
    <SettingsSection
      title="Promo Code Management For Course Purchase"
      description="Create and manage discount codes for your services"
      icon={Tag}
    >
      {/* Add Button */}
      <div className="mb-4">
        <button
          disabled={isLoading}
          onClick={handleOpenModal}
          className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add New Promo Code
        </button>
      </div>

      {/* List Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-slate-300">Promo Codes</h4>
          {promoCodes?.length > 0 && (
            <span className="text-xs text-slate-400 bg-slate-700/30 px-2 py-0.5 rounded">
              {promoCodes?.length} {promoCodes?.length === 1 ? 'code' : 'codes'}
            </span>
          )}
        </div>

        {/* Fixed Height Scrollable Container */}
        <div className="h-[420px] overflow-hidden">
          {isCodeLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
          ) : promoCodes?.length === 0 ? (
            <div className="flex items-start gap-2 p-3 bg-slate-700/20 border border-slate-600/30 rounded-lg">
              <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400">No promocode created yet</p>
            </div>
          ) : (
            <div className="h-full overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-500 glass-scrollbar">
              {promoCodes?.map(promo => (
                <PromocodeRow key={promo?.id} promo={promo} setEditingPromoCode={setEditingPromoCode} setIsModalOpen={setIsModalOpen} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <PromocodeModal Modal={Modal} isModalOpen={isModalOpen} promoCodes={promoCodes} setIsModalOpen={setIsModalOpen} editingPromoCode={editingPromoCode} />

    </SettingsSection>
  );
}