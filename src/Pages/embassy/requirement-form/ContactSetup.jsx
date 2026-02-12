import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { decodeBase64Url } from "../../../util/encodeDecode/base64";
import { useDispatch } from "react-redux";
import { updateEmbassyByEmail } from "../../../Redux/Slice/embassySlice";
import getSweetAlert from "../../../util/alert/sweetAlert";
import hotToast from "../../../util/alert/hot-toast";
import { addNotification } from "../../../Redux/Slice/notificationSlice";

const ContactSetup = () => {
  const { embassyEmail, redirectPath } = useParams();
  const emailId = decodeBase64Url(embassyEmail);
  const path = decodeBase64Url(redirectPath);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      phone: "",
      physicalAddress: "",
      website: "",
      establishedDate: "",
      workingHoursFrom: "",
      workingHoursTo: ""
    }
  });

  const workingHoursFrom = watch("workingHoursFrom");

  const timeSlots = useMemo(() => {
    const slots = [];
    const startHour = 9;
    const endHour = 18;

    for (let hour = startHour; hour <= endHour; hour++) {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour;

      const value = `${hour.toString().padStart(2, "0")}:00`;
      const label = `${displayHour}:00 ${period}`;

      slots.push({ value, label });
    }

    return slots;
  }, []);


  // Filter end time slots to only show times after start time
  const availableEndTimeSlots = useMemo(() => {
    if (!workingHoursFrom) return timeSlots;
    return timeSlots.filter(slot => slot.value > workingHoursFrom);
  }, [workingHoursFrom, timeSlots]);

  const handleContactSubmit = (data) => {
    setIsSubmitting(true);
    // console.log("Additional embassy Data:", data);

    const updateData = {
      address: data?.physicalAddress,
      contact_no: data?.phone,
      website_url: data?.website,
      establish_date: data?.establishedDate,
      starting_hours: data?.workingHoursFrom,
      ending_hours: data?.workingHoursTo
    }

    const notification_obj = {
      application_id: null,
      title: `New embassy request received for email Id ${emailId?.slice(0, 5)}######`,
      receiver_type: 'admin',
      receiver_country_id: null,
      mark_read: false
    }

    dispatch(updateEmbassyByEmail({ email: emailId, updateData }))
      .then(res => {
        // console.log('Response for adding additional data', res);

        if (res.meta.requestStatus === "fulfilled") {

          dispatch(addNotification(notification_obj))
            .then(res => {
              // console.log('Response for adding notification', res);

              if (res.meta.requestStatus === "fulfilled") {
                if (path == 'login') {
                  navigate("/embassy/auth");
                } else if (path == 'countrySetup') {
                  navigate("/embassy/country-setup");
                } else if (path == 'review') {
                  navigate("/embassy/review");
                } else if (path == 'reject') {
                  navigate("/embassy/reject");
                } else if (path == 'approved') {
                  navigate("/embassy/approved");
                } else {
                  navigate("/embassy/dashboard");
                }
                hotToast('Profile created successfully', "success");
                reset();
              }
              else {
                getSweetAlert('Oops...', 'Something went wrong!', 'info');
              }
            })
            .catch(err => {
              console.log('Error occured', err);
              getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
        }
        else {
          getSweetAlert('Oops...', 'Something went wrong!', 'info');
        }
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }

  return (
    <div
      className="min-h-screen flex justify-center items-center px-4 py-8"
      style={{
        backgroundImage: `url(/Slider1.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="w-full max-w-6xl flex flex-col md:flex-row shadow-2xl rounded-xl overflow-hidden
        md:h-[650px]"
      >
        {/* LEFT VIDEO (TABLET + DESKTOP) */}
        <div className="hidden md:block md:w-1/2 relative bg-black/80">
          <video autoPlay loop muted playsInline className="absolute w-full h-full object-cover">
            <source src="/signup.mp4" type="video/mp4" />
          </video>

          <div className="relative z-10 text-white h-full px-10 flex flex-col justify-center bg-black/50">
            <h4 className="text-3xl font-bold mb-4">
              Contact Setup
            </h4>
            <p className="text-base mb-6">
              Add your embassy contact details to help visitors reach you
            </p>

            <div className="flex items-center gap-2 text-sm text-white/70">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>One-time setup process</span>
            </div>
          </div>
        </div>

        {/* RIGHT FORM (ALL DEVICES) */}
        <form onSubmit={handleSubmit(handleContactSubmit)} className="w-full md:w-1/2 bg-black/20 backdrop-blur-md text-white px-6 sm:px-8 md:px-12 py-6 md:py-8 flex flex-col overflow-y-auto glass-scrollbar" noValidate>

          <div className="mb-6 text-center">
            <h4 className="text-2xl sm:text-3xl font-bold mb-2">
              Embassy Contact Details
            </h4>
            <p className="text-sm text-white/60">
              Provide accurate contact information for verification
            </p>
          </div>

          <div className="space-y-4 flex-1">
            {/* EMAIL ADDRESS */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email" value={emailId}
                placeholder="contact@embassy.com" readOnly
                className="w-full px-4 py-2.5 rounded-md bg-white/10 text-white placeholder-white/50
                border border-white/30 focus:border-white transition duration-300
                focus:outline-none focus:ring-2 focus:ring-white/20 disabled cursor-not-allowed"
              />
            </div>

            {/* PHONE NUMBER */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                {...register("phone", {
                  required: "Contact number is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Enter a valid contact number"
                  }
                })}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2.5 rounded-md bg-white/10 text-white placeholder-white/50
                border border-white/30 focus:border-white transition duration-300
                focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1.5">{errors.phone.message}</p>
              )}
            </div>

            {/* PHYSICAL ADDRESS */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Physical Address
              </label>
              <textarea
                rows={2}
                {...register("physicalAddress", { required: "Address is required" })}
                placeholder="123 Embassy Street, City, Country"
                className="w-full px-4 py-2.5 rounded-md bg-white/10 text-white placeholder-white/50
                border border-white/30 focus:border-white transition duration-300
                focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
              />
              {errors.physicalAddress && (
                <p className="text-red-400 text-xs mt-1.5">{errors.physicalAddress.message}</p>
              )}
            </div>

            {/* OFFICIAL WEBSITE */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Official Website
              </label>
              <input
                type="url" inputMode="url"
                {...register("website", {
                  required: "Website is required",
                  pattern: {
                    value: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
                    message: "Invalid website URL"
                  }
                })}
                placeholder="https://www.embassy.com"
                className="w-full px-4 py-2.5 rounded-md bg-white/10 text-white placeholder-white/50
                border border-white/30 focus:border-white transition duration-300
                focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              {errors.website && (
                <p className="text-red-400 text-xs mt-1.5">{errors.website.message}</p>
              )}
            </div>

            {/* ESTABLISHED DATE */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Established Date
              </label>
              <input type="date"
                max={new Date().toISOString().split("T")[0]}
                {...register("establishedDate", {
                  required: "Established date is required",
                  validate: (value) => {
                    // Enforce 4-digit year
                    const year = value?.split("-")[0];
                    if (!year || year.length !== 4) {
                      return "Year must be 4 digits";
                    }

                    // Prevent future date (extra safety)
                    const selected = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (selected > today) {
                      return "Established date cannot be in the future";
                    }
                    return true;
                  },
                })}
                className="w-full px-4 py-2.5 rounded-md bg-white/10 text-white
                    border border-white/30 focus:border-white transition duration-300
                    focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              {errors.establishedDate && (
                <p className="text-red-400 text-xs mt-1.5">{errors.establishedDate.message}</p>
              )}
            </div>

            {/* WORKING HOURS */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Working Hours <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <select
                    {...register("workingHoursFrom", {
                      required: "Start time is required"
                    })}
                    className="w-full px-4 py-2.5 rounded-md bg-white/10 text-white
                    border border-white/30 focus:border-white transition duration-300
                    focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem',
                      colorScheme: 'dark'
                    }}
                  >
                    <option value="" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Select start time</option>
                    {timeSlots.map((slot) => (
                      <option key={`from-${slot.value}`} value={slot.value} style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-white/60 mt-1">From</p>
                  {errors.workingHoursFrom && (
                    <p className="text-red-400 text-xs mt-1">{errors.workingHoursFrom.message}</p>
                  )}
                </div>

                <div>
                  <select
                    {...register("workingHoursTo", {
                      required: "End time is required",
                      validate: (value, formValues) => {
                        if (!formValues.workingHoursFrom || !value) return true;
                        return value > formValues.workingHoursFrom || "End time must be after start time";
                      }
                    })}
                    className="w-full px-4 py-2.5 rounded-md bg-white/10 text-white
                    border border-white/30 focus:border-white transition duration-300
                    focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem',
                      colorScheme: 'dark'
                    }}
                    disabled={!workingHoursFrom}
                  >
                    <option value="" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
                      {workingHoursFrom ? 'Select end time' : 'Select start time first'}
                    </option>
                    {availableEndTimeSlots.map((slot) => (
                      <option key={`to-${slot.value}`} value={slot.value} style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-white/60 mt-1">To</p>
                  {errors.workingHoursTo && (
                    <p className="text-red-400 text-xs mt-1">{errors.workingHoursTo.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 mt-6 rounded-md font-semibold text-white bg-black hover:bg-black/80 transition duration-300 ${isSubmitting ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
          >
            {isSubmitting ? 'Processing...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactSetup;