import React, { useMemo, useState } from 'react'
import { Plus, Loader2, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useForm } from 'react-hook-form'
import getSweetAlert from '../../../../util/alert/sweetAlert'
import { useDispatch } from 'react-redux'
import { addHoliday, fetchHolidays } from '../../../../Redux/Slice/holidaySlice'
import hotToast from '../../../../util/alert/hot-toast'
import { addNotification } from '../../../../Redux/Slice/notificationSlice'

const pad2 = (num) => String(num).padStart(2, "0")
const unpad2 = (num) => String(num).replace(/^0+/, "") || "0";

const HolidayModal = ({ showModal, setShowModal, holidays, currentMonth, setCurrentMonth, uniqueCountryIds, monthNames }) => {
    const dispatch = useDispatch();
    const [isAdding, setIsAdding] = useState(false)

    const { register, handleSubmit, setValue, watch, formState: { errors, isValid }, reset } = useForm({
        defaultValues: { month: null, day: null, description: "" },
        mode: "onChange"
    })

    const selectedMonth = watch("month")
    const selectedDay = watch("day")

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const holidaySet = useMemo(() => {
        const set = new Set()
        holidays?.forEach(h => {
            const [, month, day] = h.date.match(/month:(\d+),day:(\d+)/) || []
            if (month && day) {
                set.add(`${pad2(month)}-${pad2(day)}`)
            }
        })
        return set
    }, [holidays])

    const handlePreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
    }

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
    }

    const getDaysInMonth = (date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        return {
            daysInMonth: lastDay.getDate(),
            startingDayOfWeek: firstDay.getDay()
        }
    }

    const generateCalendarDays = () => {
        const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth)
        const days = []
        for (let i = 0; i < startingDayOfWeek; i++) days.push(null)
        for (let d = 1; d <= daysInMonth; d++) days.push(d)
        return days
    }

    const isDateSelected = (day) => {
        if (!day || !selectedMonth || !selectedDay) return false
        return (
            pad2(currentMonth.getMonth() + 1) === selectedMonth &&
            pad2(day) === selectedDay
        )
    }

    const isDateHoliday = (day) => {
        if (!day) return false
        const month = pad2(currentMonth.getMonth() + 1)
        return holidaySet.has(`${month}-${pad2(day)}`)
    }

    const handleDateSelect = (day) => {
        if (!day) return

        const month = pad2(currentMonth.getMonth() + 1)
        const dayFormatted = pad2(day)

        if (holidaySet.has(`${month}-${dayFormatted}`)) {
            getSweetAlert('Already a Holiday', 'This date already has a holiday scheduled', 'warning');
            return
        }

        setValue("month", month, { shouldValidate: true })
        setValue("day", dayFormatted, { shouldValidate: true })
    }

    const getSelectedDateDisplay = () => {
        if (!selectedMonth || !selectedDay) return null
        const date = new Date(2024, Number(selectedMonth) - 1, Number(selectedDay))
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long"
        })
    }

    const handleAddHoliday = async (data) => {
        try {
            setIsAdding(true)
            await new Promise(res => setTimeout(res, 500))

            const notification_obj = {
                application_id: null,
                title: `New holiday applicable on ${data.day},${monthNames[unpad2(data.month) - 1]?.slice(0, 3)} for celebration of ${data.description}`,
                receiver_type: 'embassy',
                receiver_country_id: uniqueCountryIds,
                mark_read: false
            }

            const holidayObj = {
                date: `{month:${data.month},day:${data.day}}`,
                event_name: data.description?.split(" ")?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase())?.join(" "),
                status: true
            }
            // console.log('Holiday object', holidayObj);

            dispatch(addHoliday(holidayObj))
                .then(res => {
                    // console.log('Response for adding new holiday', res);

                    if (res.meta.requestStatus === "fulfilled") {

                        dispatch(addNotification(notification_obj))
                            .then(res => {
                                // console.log('Response for adding notification', res);

                                if (res?.meta?.requestStatus == "fulfilled") {
                                    setShowModal(false);
                                    reset();
                                    hotToast("Holiday added successfully", "success");
                                    dispatch(fetchHolidays());
                                }
                                else {
                                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                }
                            })
                            .catch(err => {
                                console.log('Error occured', err);
                                getSweetAlert('Oops...', 'Something went wrong!', 'error');
                            })
                    }
                    else {
                        getSweetAlert('Oops...', res.payload, 'info');
                    }
                })
                .catch(err => {
                    console.log('Error occured', err);
                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                })
        } catch {
            getSweetAlert("Error", "Failed to add holiday", "error")
        } finally {
            setIsAdding(false)
        }
    }

    const closeModal = () => {
        reset();
        setShowModal(false)
    }

    const Modal = ({ isOpen, children }) => {
        if (!isOpen) return null
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                    {children}
                </div>
            </div>
        )
    }

    return (
        <Modal isOpen={showModal}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">Add Holiday</h3>
                <button
                    onClick={() => closeModal()}
                    className="p-1 hover:bg-slate-700/50 rounded-lg cursor-pointer"
                >
                    <X className="w-5 h-5 text-slate-400" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Calendar */}
                <div className="bg-slate-700/20 border border-slate-600/40 rounded-lg p-4 space-y-3">
                    {/* Month Nav */}
                    <div className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                        <button onClick={handlePreviousMonth} className="p-2 hover:bg-slate-600/40 rounded-lg">
                            <ChevronLeft size={18} className="text-blue-400" />
                        </button>
                        <span className="text-sm font-semibold text-white">
                            {monthNames[currentMonth.getMonth()]}
                        </span>
                        <button onClick={handleNextMonth} className="p-2 hover:bg-slate-600/40 rounded-lg">
                            <ChevronRight size={18} className="text-blue-400" />
                        </button>
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map(d => (
                            <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {generateCalendarDays().map((day, idx) => {
                            const selected = isDateSelected(day)
                            const holiday = isDateHoliday(day)

                            return (
                                <button key={idx}
                                    onClick={() => handleDateSelect(day)}
                                    disabled={!day || holiday}
                                    className={`
                                        aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-all
                                        ${!day ? "invisible" : ""}
                                        ${holiday ? "bg-red-500/20 text-red-300 cursor-not-allowed border border-red-500/30" : ""}
                                        ${selected ? "bg-blue-500 text-white shadow-lg scale-105" : ""}
                                        ${!selected && !holiday && day ? "hover:bg-slate-600/40 text-slate-200 border border-slate-600/30" : ""}
                                    `}>
                                    {day}
                                </button>
                            )
                        })}
                    </div>

                    {/* Hidden RHF fields */}
                    <input type="hidden" {...register("month", { required: true })} />
                    <input type="hidden" {...register("day", { required: true })} />

                    {(errors.month || errors.day) && (
                        <p className="text-xs text-red-400 mt-2">
                            Please select a date from the calendar
                        </p>
                    )}

                    {getSelectedDateDisplay() && (
                        <div className="bg-blue-500/10 rounded-lg p-2 border border-blue-500/30">
                            <p className="text-xs text-blue-300 font-medium">Selected Date</p>
                            <p className="text-sm font-semibold text-blue-200">
                                {getSelectedDateDisplay()} (Repeats every year)
                            </p>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Holiday Name
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Republic Day"
                        disabled={isAdding}
                        maxLength={100}
                        {...register("description", {
                            required: "Holiday name is required"
                        })}
                        className="w-full px-3 py-2 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white"
                    />
                    {errors?.description && (
                        <p className="text-xs text-red-400 mt-1">
                            {errors?.description?.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2 p-4 border-t border-slate-700">
                <button onClick={() => closeModal()} disabled={isAdding}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit(handleAddHoliday)}
                    disabled={isAdding || !isValid}
                    className={`flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm flex items-center justify-center gap-2 disabled:bg-blue-500/50 ${isValid ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                >
                    {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {isAdding ? "Adding..." : "Add Holiday"}
                </button>
            </div>
        </Modal>
    )
}

export default HolidayModal