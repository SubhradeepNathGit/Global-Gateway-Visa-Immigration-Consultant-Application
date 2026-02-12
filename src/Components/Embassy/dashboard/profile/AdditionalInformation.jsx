import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import hotToast from "../../../../util/alert/hot-toast";
import { updateEmbassyById } from "../../../../Redux/Slice/embassySlice";
import getSweetAlert from "../../../../util/alert/sweetAlert";
import { useDispatch } from "react-redux";
import { addNotification } from "../../../../Redux/Slice/notificationSlice";

const AdditionalInformation = ({ profileData }) => {
  // console.log('Embassy profile data', profileData);

  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      workingHoursFrom: "",
      workingHoursTo: "",
    },
  });

  useEffect(() => {
    if (profileData) {
      reset({
        workingHoursFrom: profileData.starting_hours || "",
        workingHoursTo: profileData.ending_hours || "",
      });
    }
  }, [profileData, reset]);

  const workingHoursFrom = watch("workingHoursFrom");

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour;

      slots.push({
        value: `${hour.toString().padStart(2, "0")}:00`,
        label: `${displayHour}:00 ${period}`,
      });
    }
    return slots;
  }, []);

  const availableEndSlots = useMemo(() => {
    if (!workingHoursFrom) return [];
    return timeSlots.filter(slot => slot.value > workingHoursFrom);
  }, [workingHoursFrom, timeSlots]);

  const notification_obj = {
    application_id: null,
    title: `${profileData?.country_name} Embassy changes working hour`,
    receiver_type: 'admin',
    receiver_country_id: null,
    mark_read: false
  }

  const handleSave = async (data) => {
    const updateData = {
      ...profileData,
      starting_hours: data.workingHoursFrom,
      ending_hours: data.workingHoursTo,
    };

    dispatch(updateEmbassyById({ id: profileData.id, updateData }))
      .then(res => {
        // console.log('Response for updating embassy timing', res);

        if (res.meta.requestStatus === "fulfilled") {

          dispatch(addNotification(notification_obj))
            .then(res => {
              // console.log('Response for adding notification', res);

              if (res.meta.requestStatus === "fulfilled") {
                hotToast("Working hours updated successfully", "success");
                setIsEditing(false);
              }
              else {
                getSweetAlert('Oops...', 'Something went wrong!', 'info');
              }
            })
            .catch(err => {
              console.log('Error occured', err);
              getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
        } else {
          getSweetAlert("Oops...", "Something went wrong!", "error");
        }

      }).catch(err => {
        getSweetAlert("Oops...", "Something went wrong!", "error");
      })
  };

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <div className="pt-6 border-t border-gray-200">
        {/* ---------- Header ---------- */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Additional Details</h3>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition"
            >
              Edit
            </button>
          )}
          {isEditing && (
            <button
              type="submit"
              className="mt-4 px-4 py-2 text-sm font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition"
            >
              Save
            </button>)
          }
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* -------- Established -------- */}
        <div className="flex items-start gap-4 p-4 bg-pink-50 rounded-lg border border-gray-200">
          <div className="w-12 h-12 bg-pink-100 flex items-center justify-center rounded-lg">
            <Calendar size={20} className="text-pink-600" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Established
            </label>
            <p className="text-gray-900 font-medium">
              {profileData?.establish_date?.split("-")[0] ?? 'Not provided'}
            </p>
          </div>
        </div>

        {/* -------- Working Hours -------- */}
        <div className="flex items-start gap-4 p-4 bg-teal-50 rounded-lg border border-gray-200">
          <div className="w-12 h-12 bg-teal-100 flex items-center justify-center rounded-lg">
            <Clock size={20} className="text-teal-600" />
          </div>

          <div className="w-full">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Working Hours
            </label>

            {isEditing ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    {...register("workingHoursFrom", {
                      required: "Start time is required",
                    })}
                    className="w-full px-3 py-2 border-2 rounded-lg"
                  >
                    <option value="">From</option>
                    {timeSlots.map(slot => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>

                  <select
                    {...register("workingHoursTo", {
                      required: "End time is required",
                      validate: (value, formValues) =>
                        value > formValues.workingHoursFrom ||
                        "End time must be after start time",
                    })}
                    disabled={!workingHoursFrom}
                    className="w-full px-3 py-2 border-2 rounded-lg disabled:bg-gray-100"
                  >
                    <option value="">
                      {workingHoursFrom ? "To" : "Select start time"}
                    </option>
                    {availableEndSlots.map(slot => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>

                {errors.workingHoursFrom && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.workingHoursFrom.message}
                  </p>
                )}
                {errors.workingHoursTo && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.workingHoursTo.message}
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-900 font-medium">
                {profileData?.starting_hours} — {profileData?.ending_hours}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default AdditionalInformation;
