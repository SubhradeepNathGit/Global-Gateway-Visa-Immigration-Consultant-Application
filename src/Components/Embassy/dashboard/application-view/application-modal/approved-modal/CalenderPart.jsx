import React, { useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHolidays } from "../../../../../../Redux/Slice/holidaySlice";
import getSweetAlert from "../../../../../../util/alert/sweetAlert";

const CalenderPart = ({ currentMonth, setCurrentMonth, selectedDate, setSelectedDate }) => {
    const dispatch = useDispatch();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const { isHolidayLoading, holidayData, holidayError } = useSelector(state => state.holiday);

    // Fetch holidays dynamically
    useEffect(() => {
        dispatch(fetchHolidays('active'))
            .then(res => {
                // console.log('Fetch holiday response', res);
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    }, [dispatch]);

    const handlePreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay() };
    };

    const isDateDisabled = (day) => {
        if (!day) return true;

        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, 0, 0, 0, 0);

        const now = new Date();
        const minSelectableDateTime = new Date(
            now.getTime() + 24 * 60 * 60 * 1000
        );

        // allow already selected date
        if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
            return false;
        }

        // block only if the entire date starts within next 24 hours
        if (date < minSelectableDateTime) return true;

        // block weekends
        if (date.getDay() === 0 || date.getDay() === 6) return true;

        // block holidays dynamically
        if (holidayData?.length) {
            for (const holiday of holidayData) {
                const [monthMatch, dayMatch] = holiday.date.match(/month:(\d+),day:(\d+)/).slice(1).map(Number);

                if (monthMatch === date.getMonth() + 1 && dayMatch === date.getDate()) {
                    return true;
                }
            }
        }

        return false;
    };


    const handleDateSelect = (day) => {
        if (!day || isDateDisabled(day)) return;
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(date);
    };

    const generateCalendarDays = () => {
        const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
        const days = [];
        for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
        for (let day = 1; day <= daysInMonth; day++) days.push(day);
        return days;
    };

    // console.log('List of holidays', holidayData);

    if (isHolidayLoading) {
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
                <Calendar size={20} className="text-blue-600" /> Select Date
            </h3>

            <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                <button onClick={handlePreviousMonth} className="p-2 hover:bg-blue-100 rounded-lg">
                    <ChevronLeft size={20} className="text-blue-600" />
                </button>
                <span className="text-lg font-semibold text-gray-900">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button onClick={handleNextMonth} className="p-2 hover:bg-blue-100 rounded-lg">
                    <ChevronRight size={20} className="text-blue-600" />
                </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 flex-1">
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {dayNames.map(day => (
                        <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {generateCalendarDays().map((day, idx) => {
                        const isSelected =
                            selectedDate &&
                            day === selectedDate.getDate() &&
                            currentMonth.getMonth() === selectedDate.getMonth() &&
                            currentMonth.getFullYear() === selectedDate.getFullYear();

                        const isDisabled = isDateDisabled(day);

                        return (
                            <button key={idx} onClick={() => handleDateSelect(day)}
                                disabled={isDisabled} className={`
                  aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                  ${!day ? "invisible" : ""}
                  ${isDisabled ? "text-gray-300 cursor-not-allowed" : ""}
                  ${isSelected ? "bg-blue-600 text-white shadow-md scale-105" : ""}
                  ${!isSelected && !isDisabled ? "hover:bg-blue-50 text-gray-900" : ""}
                `}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            </div>

            {selectedDate && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-blue-600 font-medium mb-1">Selected Date</p>
                    <p className="text-lg font-semibold text-blue-900">
                        {selectedDate.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>
            )}
        </div>
    );
};

export default CalenderPart;
