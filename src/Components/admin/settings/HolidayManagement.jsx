import React, { useState, useEffect, useMemo } from "react";
import { Calendar, Plus, AlertCircle, Loader2 } from "lucide-react";
import HolidayModal from "./holiday/HolidayModal";
import HolidayRow from "./holiday/HolidayRow";
import { useDispatch, useSelector } from "react-redux";
import { fetchHolidays } from "../../../Redux/Slice/holidaySlice";
import getSweetAlert from "../../../util/alert/sweetAlert";
import { fetchAllEmbassy } from "../../../Redux/Slice/embassySlice";

export default function HolidayManagement({ SettingsSection }) {
  const dispatch = useDispatch();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [newHoliday, setNewHoliday] = useState({ month: null, day: null, description: "" });
  const [showModal, setShowModal] = useState(false);
  const { isHolidayLoading, holidayData, holidayError } = useSelector(state => state.holiday);
  const { isEmbassyLoading, allEmbassyData: embassyData, hasEmbassyerror } = useSelector(state => state?.embassy);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const filteredCountryIds = embassyData?.filter(embassy => embassy != null && embassy.is_blocked == false && embassy.is_approved == 'fulfilled');
  const countryIds = filteredCountryIds?.map(item => item.country_id) || [];
  const uniqueCountryIds = [...new Set(countryIds)];

  useEffect(() => {
    dispatch(fetchAllEmbassy())
      .then(res => {
        // console.log('Response for fetching all embassy', res);
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }, []);

  useEffect(() => {
    dispatch(fetchHolidays())
      .then(res => {
        // console.log('Response for fetching holiday list',res);
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }, []);

  const openModal = () => {
    setNewHoliday({ month: null, day: null, description: "" });
    setCurrentMonth(new Date());
    setShowModal(true);
  };

  // console.log('Holiday list',holidayData);
  // console.log('Embassy list',uniqueCountryIds);

  return (
    <>
      <SettingsSection
        title="Holiday Management"
        description="Set recurring holidays for the appointment calendar (date repeats annually)"
        icon={Calendar}
      >
        {/* Add Holiday Button */}
        <div className="mb-4">
          <button disabled={isHolidayLoading}
            onClick={openModal}
            className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add New Holiday
          </button>
        </div>

        {/* Holidays List - Fixed Height Container */}
        <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <h4 className="text-sm font-medium text-slate-300">Scheduled Holidays</h4>
            {holidayData?.length > 0 && (
              <span className="text-xs text-slate-400 bg-slate-700/30 px-2 py-0.5 rounded">
                {holidayData?.length} {holidayData?.length === 1 ? 'day' : 'days'}
              </span>
            )}
          </div>

          {/* Fixed Height Scrollable Area - Shows exactly 4 items */}
          <div className="h-[420px] overflow-hidden">
            {isHolidayLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
              </div>
            ) : (!isHolidayLoading && holidayData?.length == 0) ? (
              <div className="flex items-start gap-2 p-3 bg-slate-700/20 border border-slate-600/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400">No holidays scheduled</p>
              </div>
            ) : (
              <div className="h-full overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-500 glass-scrollbar">
                {holidayData?.map(holiday => (
                  <HolidayRow key={holiday?.id} holiday={holiday} monthNames={monthNames} uniqueCountryIds={uniqueCountryIds} />
                ))}
              </div>
            )}
          </div>
        </div>
      </SettingsSection>

      {/* Modal for Adding Holiday */}
      <HolidayModal showModal={showModal} setShowModal={setShowModal} holidays={holidayData} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} uniqueCountryIds={uniqueCountryIds} monthNames={monthNames} />
    </>
  );
}