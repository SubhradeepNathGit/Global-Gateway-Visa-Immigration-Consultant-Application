import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { User, Mail, Phone, MapPin, Calendar, Globe, Home, Milestone, Loader2, Users, Heart, ChevronDown } from "lucide-react";
import Input from "../Input";
import StepButtons from "../StepButtons";
import { initApplication, saveStepPersonal, saveStepProgress } from "../../../../../Redux/Slice/applicationSlice";
import getSweetAlert from "../../../../../util/alert/sweetAlert";
import { usePersonalInfoByApplicationId } from "../../../../../tanstack/query/getApplicationPersonalInfo";
import { addActivity } from "../../../../../Redux/Slice/activitySlice";

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "Must be at least 2 characters")
    .matches(/^[a-zA-Z\s'-]+$/, "Only letters, spaces, hyphens and apostrophes allowed"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Must be at least 2 characters")
    .matches(/^[a-zA-Z\s'-]+$/, "Only letters, spaces, hyphens and apostrophes allowed"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required")
    .matches(/^[a-z0-9._-]+@[a-z0-9.-]+\.[a-zA-Z.]{2,}$/, "Please enter a valid email"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[6-9]\d{9}$/, "Please enter a valid phone number")
    .min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: yup
    .string()
    .required("Date of birth is required")
    .matches(/^(?:(?:[0-9]{4})-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12][0-9]|3[01])|(?:0[469]|11)-(?:0[1-9]|[12][0-9]|30)|02-(?:0[1-9]|1[0-9]|2[0-8]))|(?:(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29))$/, "Please enter a valid date")
    .test("age", "You must be at least 18 years old", (value) => {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18;
    }),
  gender: yup
    .string()
    .required("Gender is required")
    .oneOf(["Male", "Female", "Other"], "Please select a valid gender"),
  maritalStatus: yup
    .string()
    .required("Marital status is required")
    .oneOf(["Single", "Married", "Widowed", "Divorced", "Separated"], "Please select a valid marital status"),
  nationality: yup
    .string()
    .required("Nationality is required")
    .min(2, "Please select your nationality"),
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Please enter a complete address"),
  city: yup
    .string()
    .required("City is required")
    .min(2, "Please enter a valid city name"),
  postalCode: yup
    .string()
    .required("Postal code is required")
    .matches(/^[A-Za-z0-9][A-Za-z0-9\s-]{2,10}[A-Za-z0-9]$/, "Please enter a valid postal code"),
  state: yup
    .string()
    .required("State is required")
    .min(2, "Please enter a valid state name"),
  country: yup
    .string()
    .required("Country is required")
    .min(2, "Please enter a valid country name"),
});

// Custom Dropdown Component
const CustomSelect = ({ label, icon: Icon, options, value, onChange, error,onBlur, touched, required, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => setIsOpen(false), 200);
          }}
          className={`w-full px-4 py-3.5 pl-11 pr-10 rounded-xl border-2 transition-all duration-200 outline-none bg-white text-left font-medium
            ${error
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
              : touched && value
                ? 'border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-50'
                : isFocused || isOpen
                  ? 'border-red-400 focus:ring-4 focus:ring-red-50'
                  : 'border-gray-200 hover:border-gray-300'
            }
            ${!value ? 'text-gray-400' : 'text-gray-900'}
          `}
        >
          <Icon
            size={19}
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200
              ${error ? 'text-red-400' : touched && value ? 'text-green-500' : isFocused || isOpen ? 'text-red-500' : 'text-gray-400'}
            `}
          />

          <span className="block truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <ChevronDown
            size={18}
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-all duration-200
              ${isOpen ? 'rotate-180 text-red-500' : 'text-gray-400'}
            `}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left transition-all duration-150 flex items-center gap-3
                  ${value === option.value
                    ? 'bg-red-50 text-red-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50 font-medium'
                  }
                `}
              >
                {value === option.value && (
                  <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span className={value === option.value ? '' : 'ml-7'}>{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {!error && touched && value && (
        <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Looks good!
        </p>
      )}
    </div>
  );
};

export default function Step1PersonalInfo({ onNext, onApplicationCreated, country_id, application_id, user_data }) {
  const dispatch = useDispatch();
  const { isApplicationLoading, application, personalInfo, isApplicationError } = useSelector(state => state.application);
  const { data: personalInfoData, isLoading: isApplicationDataLoading, error: isApplicationSDataError } = usePersonalInfoByApplicationId(application_id);

  const { register, handleSubmit, formState: { errors, touchedFields }, reset, control } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {},
  });

  // console.log(user_data);

  useEffect(() => {
    if (personalInfoData) {
      reset({
        firstName: personalInfoData?.first_name || "",
        lastName: personalInfoData?.last_name || "",
        email: personalInfoData?.email || "",
        phone: personalInfoData?.phone || "",
        dateOfBirth: personalInfoData?.date_of_birth || "",
        gender: personalInfoData?.gender || "",
        maritalStatus: personalInfoData?.marital_status || "",
        nationality: personalInfoData?.nationality || "",
        address: personalInfoData?.address || "",
        city: personalInfoData?.city || "",
        postalCode: personalInfoData?.postal_code || "",
        state: personalInfoData?.state || "",
        country: personalInfoData?.country || "",
      });
    }
  }, [personalInfoData, reset]);

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  const maritalStatusOptions = [
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: 'Widowed', label: 'Widowed' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Separated', label: 'Separated' },
  ];

  const submitPersonalDetails = async (data) => {

    const application_obj = {
      id: personalInfoData?.application_id || undefined,
      user_id: user_data?.id,
      country_id: country_id,
      current_step: 1,
      is_completed: false,
      status: 'pending',
      completed_steps: [],
      rejection_reason: null,
      appointment_date: null,
      approval_date: null,
      created_at: new Date().toISOString()
    }

    const personalInfo_obj = {
      first_name: data.firstName,
      last_name: data.lastName,
      date_of_birth: data.dateOfBirth,
      gender: data.gender,
      marital_status: data.maritalStatus,
      nationality: data.nationality?.charAt(0)?.toUpperCase() + data.nationality?.slice(1)?.toLowerCase(),
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      postal_code: data.postalCode,
      state: data.state,
      country: data.country
    }

    const activity_obj = {
      title: 'Passport details required',
      icon: 'required'
    }

    dispatch(initApplication(application_obj))
      .then(res => {
        if (res.meta.requestStatus === "fulfilled") {
          dispatch(saveStepPersonal({ applicationId: res.payload, payload: personalInfo_obj }))
            .then(res => {
              if (res.meta.requestStatus === "fulfilled") {
                dispatch(saveStepProgress({ applicationId: res.payload.application_id, step: 2, completedSteps: [1] }))
                  .then(res => {
                    if (res.meta.requestStatus === "fulfilled") {
                      dispatch(addActivity({ ...activity_obj, application_id: res?.meta?.arg?.applicationId }))
                        .then(res => {
                          if (res.meta.requestStatus === "fulfilled") {
                            const appId = res?.meta?.arg?.application_id;
                            onApplicationCreated(appId);
                            onNext();
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

  if (isApplicationDataLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-18 h-18 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-200">
            <User className="text-white" size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Personal Information
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">Please provide your details as they appear on your passport</p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <form className="space-y-6" >
        {/* Personal Details Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User size={20} className="text-red-600" strokeWidth={2.5} />
            Personal Details
          </h3>

          <div className="grid sm:grid-cols-2 gap-5">
            <Input
              id="firstName"
              label="First Name"
              icon={User}
              placeholder="John"
              value={user_data?.name?.split(" ")?.slice(0, -1)?.join(" ")}
              {...register('firstName')}
              errors={errors}
              touched={touchedFields.firstName}
              required disabled
            />

            <Input
              id="lastName"
              label="Last Name"
              icon={User}
              placeholder="Doe"
              value={user_data?.name?.split(" ")?.slice(1)}
              {...register('lastName')}
              errors={errors}
              touched={touchedFields.lastName}
              required disabled
            />

            <Input
              id="dateOfBirth"
              label="Date of Birth"
              type="date"
              icon={Calendar}
              {...register('dateOfBirth')}
              errors={errors}
              touched={touchedFields.dateOfBirth}
              required
            />

            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Gender"
                  icon={Users}
                  options={genderOptions}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.gender?.message}
                  touched={touchedFields.gender}
                  required
                  placeholder="Select Gender"
                />
              )}
            />

            <Controller
              name="maritalStatus"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Marital Status"
                  icon={Heart}
                  options={maritalStatusOptions}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.maritalStatus?.message}
                  touched={touchedFields.maritalStatus}
                  required
                  placeholder="Select Marital Status"
                />
              )}
            />

            <Input
              id="nationality"
              label="Nationality"
              icon={Globe}
              placeholder="American"
              {...register('nationality')}
              errors={errors}
              touched={touchedFields.nationality}
              required
            />
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Mail size={20} className="text-red-600" strokeWidth={2.5} />
            Contact Information
          </h3>

          <div className="grid sm:grid-cols-2 gap-5">
            <Input
              id="email"
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="john.doe@example.com"
              value={user_data?.email}
              {...register('email')}
              errors={errors}
              touched={touchedFields.email}
              required disabled
            />

            <Input
              id="phone"
              label="Phone Number"
              type="tel"
              icon={Phone}
              placeholder="+1 (555) 123-4567"
              {...register('phone')}
              errors={errors}
              touched={touchedFields.phone}
              required
            />
          </div>
        </div>

        {/* Address Information Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Home size={20} className="text-red-600" strokeWidth={2.5} />
            Current Address
          </h3>

          <div className="space-y-5">
            <Input
              id="address"
              label="Street Address"
              icon={MapPin}
              placeholder="123 Main Street, Apt 4B"
              {...register('address')}
              errors={errors}
              touched={touchedFields.address}
              required
            />

            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                id="city"
                label="City"
                icon={MapPin}
                placeholder="New York"
                {...register('city')}
                errors={errors}
                touched={touchedFields.city}
                required
              />

              <Input
                id="postalCode"
                label="Postal Code"
                icon={Milestone}
                placeholder="100011"
                {...register('postalCode')}
                errors={errors}
                touched={touchedFields.postalCode}
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                id="state"
                label="State"
                icon={MapPin}
                placeholder="Washington"
                {...register('state')}
                errors={errors}
                touched={touchedFields.state}
                required
              />

              <Input
                id="country"
                label="Country"
                icon={MapPin}
                value={user_data?.country?.charAt(0)?.toUpperCase() + user_data?.country?.slice(1)?.toLowerCase(" ")}
                placeholder="USA"
                {...register('country')}
                errors={errors}
                touched={touchedFields.country}
                required disabled
              />
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm">
              <p className="font-bold text-blue-900 mb-1">Important: Ensure Accuracy</p>
              <p className="text-blue-800">
                All information must match your passport and official documents exactly. Any discrepancies may result in visa application delays or rejection.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <StepButtons type="submit"
          onNext={handleSubmit(submitPersonalDetails)}
          nextLabel="Continue to Passport Details"
          showBack={false}
          isLoading={isApplicationLoading}
        />
      </form>
    </div>
  );
}