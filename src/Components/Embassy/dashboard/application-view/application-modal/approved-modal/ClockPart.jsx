import React, { useMemo, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmbassyTiming } from '../../../../../../Redux/Slice/timingSlice';
import getSweetAlert from '../../../../../../util/alert/sweetAlert';

const ClockPart = ({ selectedDate, selectedTime, setSelectedTime, embassyId }) => {

  const dispatch = useDispatch();
  const { timingStarting_hours: starting_hours, timingEnding_hours: ending_hours, timingLoading } = useSelector((state) => state.timing);

  useEffect(() => {
    if (embassyId) {
      dispatch(fetchEmbassyTiming(embassyId))
        .then(res => {
          // console.log('Fetch timing response', res);
        })
        .catch(err => {
          console.log('Error occured', err);
          getSweetAlert('Oops...', 'Something went wrong!', 'error');
        })
    }
  }, [embassyId, dispatch]);

  const allSlots = useMemo(() => {
    const slots = [];
    const startHour = 9;
    const endHour = 18;

    for (let hour = startHour; hour <= endHour; hour++) {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour;

      slots.push({
        value: `${hour.toString().padStart(2, '0')}:00`,
        label: `${displayHour}:00 ${period}`,
        hour,
      });
    }

    return slots;
  }, []);

  const availableRange = useMemo(() => {
    if (!starting_hours || !ending_hours) return null;

    const [start] = starting_hours.split(':').map(Number); 
    const [end] = ending_hours.split(':').map(Number);     

    return { start, end };
  }, [starting_hours, ending_hours]);

  const isSlotDisabled = (slotHour) => {
    if (!selectedDate) return true;
    if (!availableRange) return true;

    return slotHour < availableRange.start || slotHour > availableRange.end;
  };

  const handleTimeSelect = (time) => {
    if (!selectedDate) return;
    setSelectedTime(time);
  };

  // console.log('Received timing', starting_hours, ending_hours);

  if (timingLoading) {
    return (
      <div className='flex flex-col h-screen items-center justify-center bg-transparent'>
        <div className="w-12 h-12 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className='mt-5 text-blue-600'>Loading...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Clock size={20} className="text-blue-600" />
        Select Time
      </h3>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-2 gap-3">
          {allSlots.map((slot) => {
            const isSelected = selectedTime === slot.label;
            const isDisabled = isSlotDisabled(slot.hour);

            return (
              <button
                key={slot.value}
                disabled={isDisabled}
                onClick={() => !isDisabled && handleTimeSelect(slot.label)}
                className={`
                  px-4 mt-5 ml-5 py-3 rounded-xl text-lg font-medium transition-all border-2
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${isDisabled 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                    : isSelected 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-gray-900 py-6 border-gray-200 hover:border-blue-600 hover:bg-blue-50'
                  }`}>
                {slot.label}
                {isDisabled && (
                  <span className="block text-xs mt-1 text-gray-400">
                    Unavailable
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedTime && (
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-600 font-medium mb-1">Selected Time</p>
          <p className="text-lg font-semibold text-green-900">{selectedTime}</p>
        </div>
      )}
    </div>
  );
};

export default ClockPart;