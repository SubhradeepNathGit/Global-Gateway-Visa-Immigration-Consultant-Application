import React, { useState, useEffect } from "react";
import { Plus, AlertCircle, Loader2, ClipboardClock } from "lucide-react";
import AppointmentTopicModal from "./appointment-topic/AppointmentTopicModal";
import AppointmentTopicRow from "./appointment-topic/AppointmentTopicRow";
import { useDispatch, useSelector } from "react-redux";
import getSweetAlert from "../../../util/alert/sweetAlert";
import { fetchAppointmentReasons } from "../../../Redux/Slice/appointmentReasonSlice";

export default function AppointmentTopicManagement({ SettingsSection, Modal }) {

  const dispatch = useDispatch();
  const [appointmentTopic, setAppointmentTopic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { isReasonsLoading, reasonsData, hasReasonerror } = useSelector(state => state.appointmentReason);

  useEffect(() => {
    dispatch(fetchAppointmentReasons())
      .then(res => {
        // console.log('Response for fetching appointment list',res);
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }, []);

  const openModal = () => {
    setAppointmentTopic(null);
    setShowModal(true);
  };

  // console.log('Appointment reason list',reasonsData);

  return (
    <>
      <SettingsSection
        title="Topic Management"
        description="Set topic of appointment for visa processing"
        icon={ClipboardClock}
      >
        {/* Add Holiday Button */}
        <div className="mb-4">
          <button disabled={isReasonsLoading}
            onClick={openModal}
            className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add New Topic
          </button>
        </div>

        {/* Holidays List - Fixed Height Container */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-slate-300">Available Topics</h4>
            {reasonsData?.length > 0 && (
              <span className="text-xs text-slate-400 bg-slate-700/30 px-2 py-0.5 rounded">
                {reasonsData?.length} {reasonsData?.length === 1 ? 'reason' : 'reasons'}
              </span>
            )}
          </div>

          {/* Fixed Height Scrollable Area - Shows exactly 4 items */}
          <div className="h-[420px] overflow-hidden">
            {isReasonsLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
              </div>
            ) : (!isReasonsLoading && reasonsData?.length == 0) ? (
              <div className="flex items-start gap-2 p-3 bg-slate-700/20 border border-slate-600/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400">No reason available right now.</p>
              </div>
            ) : (
              <div className="h-full overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-500 glass-scrollbar">
                {reasonsData?.map(reason => (
                  <AppointmentTopicRow key={reason?.id} reason={reason} setAppointmentTopic={setAppointmentTopic} setIsModalOpen={setShowModal} />
                ))}
              </div>
            )}
          </div>
        </div>
      </SettingsSection>

      {/* Modal for Adding Holiday */}
      <AppointmentTopicModal Modal={Modal} isModalOpen={showModal} allReasonsData={reasonsData} setIsModalOpen={setShowModal} appointmentTopic={appointmentTopic} />
    </>
  );
}