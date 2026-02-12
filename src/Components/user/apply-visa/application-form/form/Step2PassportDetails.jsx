import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FileText, Calendar, CreditCard, MapPin, AlertTriangle, Loader2 } from "lucide-react";
import { saveStepPassport, saveStepProgress } from "../../../../../Redux/Slice/applicationSlice";
import getSweetAlert from "../../../../../util/alert/sweetAlert";
import StepButtons from "./../StepButtons";
import Input from "./../Input";
import { usePassportByApplicationId } from "../../../../../tanstack/query/getApplicationPassportDetails";
import { addActivity } from "../../../../../Redux/Slice/activitySlice";

const schema = yup.object().shape({
  passportNumber: yup
    .string()
    .required("Passport number is required")
    .min(6, "Passport number must be at least 6 characters")
    .max(15, "Passport number must not exceed 15 characters")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]+$/, "Please enter a valid passport number"),

  issueDate: yup
    .string()
    .required("Issue date is required")
    .matches(/^(?:(?:[0-9]{4})-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12][0-9]|3[01])|(?:0[469]|11)-(?:0[1-9]|[12][0-9]|30)|02-(?:0[1-9]|1[0-9]|2[0-8]))|(?:(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29))$/, "Please enter a valid date")
    .test("not-future", "Issue date cannot be in the future", (value) => {
      if (!value) return false;
      const issueDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return issueDate <= today;
    }),

  expiryDate: yup
    .string()
    .required("Expiry date is required")
    .matches(/^(?:(?:[0-9]{4})-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12][0-9]|3[01])|(?:0[469]|11)-(?:0[1-9]|[12][0-9]|30)|02-(?:0[1-9]|1[0-9]|2[0-8]))|(?:(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29))$/, "Please enter a valid date")
    .test("not-expired", "Passport must not be expired", (value) => {
      if (!value) return false;
      const expiryDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return expiryDate >= today;
    })
    .test("min-validity", "Passport must be valid for at least 6 months", (value) => {
      if (!value) return false;
      const expiryDate = new Date(value);
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      sixMonthsFromNow.setHours(0, 0, 0, 0);
      return expiryDate >= sixMonthsFromNow;
    }),

  placeOfIssue: yup
    .string()
    .required("Place of issue is required")
    .min(2, "Please enter a valid location"),
});

export default function Step2PassportDetails({ onNext, onBack, user_id, application_id }) {
  const dispatch = useDispatch();
  const { isApplicationLoading, application, passport, isApplicationError } = useSelector(state => state.application);
  const { data: passportData, isLoading: isPassportDataLoading, error: isPassportDataError } = usePassportByApplicationId(application_id);

  const { register, handleSubmit, watch, formState: { errors, touchedFields }, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {},
  });

  useEffect(() => {
    if (passportData) {
      reset({
        passportNumber: passportData?.passport_number || "",
        issueDate: passportData?.issue_date || "",
        expiryDate: passportData?.expiry_date || "",
        placeOfIssue: passportData?.place_of_issue || "",
      });
    }
  }, [passportData, reset]);

  const expiryDate = watch("expiryDate");

  // console.log('Current application details', application);
  // console.log('Passport details retrive', passportData);

  const calculateDaysUntilExpiry = () => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiry = calculateDaysUntilExpiry();

  const submitPassportDetails = (data) => {
    // console.log('Received passport details', data);

    const application_obj = {
      step: 3,
      completedSteps: [1, 2]
    }

    const passportDetails_obj = {
      passport_number: data.passportNumber,
      issue_date: data.issueDate,
      expiry_date: data.expiryDate,
      place_of_issue: data.placeOfIssue
    }

    const activity_obj = {
      title: 'Visa details required',
      icon: 'required'
    }

    dispatch(saveStepPassport({ applicationId: application_id, payload: passportDetails_obj }))
      .then(res => {
        // console.log('Response for saving passport data', res);

        if (res.meta.requestStatus === "fulfilled") {
          dispatch(saveStepProgress({ applicationId: res.payload.application_id, ...application_obj }))
            .then(res => {
              // console.log('Response for updating application steps', res);

              if (res.meta.requestStatus === "fulfilled") {

                dispatch(addActivity({ ...activity_obj, application_id: res?.meta?.arg?.applicationId }))
                  .then(res => {
                    // console.log('Response for adding activity', res);

                    if (res.meta.requestStatus === "fulfilled") {

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
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  };


  if (isPassportDataLoading) {
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
            <CreditCard className="text-white" size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Passport Details
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">Provide your passport information exactly as shown on the document</p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <form className="space-y-6">
        {/* Passport Information Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText size={20} className="text-red-600" strokeWidth={2.5} />
            Passport Information
          </h3>

          <div className="space-y-5">
            <Input
              id="passportNumber"
              label="Passport Number"
              icon={FileText}
              placeholder="A12345678"
              {...register('passportNumber')}
              errors={errors}
              touched={touchedFields.passportNumber}
              required
            />

            <Input
              id="placeOfIssue"
              label="Place of Issue"
              icon={MapPin}
              placeholder="e.g., New York, USA"
              {...register('placeOfIssue')}
              errors={errors}
              touched={touchedFields.placeOfIssue}
              required
            />

            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                id="issueDate"
                label="Issue Date"
                type="date"
                icon={Calendar}
                {...register('issueDate')}
                errors={errors}
                touched={touchedFields.issueDate}
                required
              />

              <Input
                id="expiryDate"
                label="Expiry Date"
                type="date"
                icon={Calendar}
                {...register('expiryDate')}
                errors={errors}
                touched={touchedFields.expiryDate}
                required
              />
            </div>
          </div>
        </div>

        {/* Validity Status Card */}
        {daysUntilExpiry !== null && daysUntilExpiry > 0 && (
          <div
            className={`rounded-2xl shadow-lg border-2 p-6 animate-slideDown ${daysUntilExpiry < 180
              ? "bg-gradient-to-r from-red-50 to-orange-50 border-red-300"
              : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300"
              }`}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${daysUntilExpiry < 180
                  ? "bg-red-100"
                  : "bg-green-100"
                  }`}>
                  {daysUntilExpiry < 180 ? (
                    <AlertTriangle className="w-6 h-6 text-red-600" strokeWidth={2.5} />
                  ) : (
                    <FileText className="w-6 h-6 text-green-600" strokeWidth={2.5} />
                  )}
                </div>
              </div>
              <div className="flex-1">
                {daysUntilExpiry < 180 ? (
                  <>
                    <h4 className="font-bold text-red-900 mb-1.5 text-base">
                      Insufficient Validity Period
                    </h4>
                    <p className="text-sm text-red-800 leading-relaxed">
                      Your passport expires in <span className="font-bold">{daysUntilExpiry} days</span>.
                      Most countries require at least <span className="font-bold">6 months (180 days)</span> of
                      validity beyond your intended stay. Please renew your passport before applying.
                    </p>
                  </>
                ) : (
                  <>
                    <h4 className="font-bold text-green-900 mb-1.5 text-base">
                      Valid Passport ✓
                    </h4>
                    <p className="text-sm text-green-800 leading-relaxed">
                      Your passport is valid for <span className="font-bold">{daysUntilExpiry} days</span>
                      (<span className="font-bold">{Math.floor(daysUntilExpiry / 30)} months</span>).
                      This meets the minimum validity requirements for visa processing.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm">
              <p className="font-bold text-blue-900 mb-1">Passport Requirements</p>
              <ul className="text-blue-800 space-y-1">
                <li>• Passport must be valid for at least 6 months from your travel date</li>
                <li>• Enter passport number exactly as shown on your passport</li>
                <li>• Dates must match your physical passport document</li>
                <li>• Ensure there are at least 2 blank pages for visa stamps</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <StepButtons
          onBack={onBack}
          onNext={handleSubmit(submitPassportDetails)}
          nextLabel="Continue to Document Upload"
          backLabel="Back to Personal Info"
          isLoading={isApplicationLoading}
        />
      </form>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}