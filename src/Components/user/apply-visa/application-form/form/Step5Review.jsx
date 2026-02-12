import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CheckCircle, User, CreditCard, FileText, Mail, Phone, Calendar, Globe, MapPin, Home, AlertCircle, Edit2, Shield, Landmark, Briefcase, FileTypeCorner, BaggageClaim, Image } from "lucide-react";
import StepButtons from "../StepButtons";
import { usePersonalInfoByApplicationId } from "../../../../../tanstack/query/getApplicationPersonalInfo";
import { usePassportByApplicationId } from "../../../../../tanstack/query/getApplicationPassportDetails";
import { useVisaDetailsByApplicationId } from "../../../../../tanstack/query/getApplicationVisaDetails";
import { useDocumentsByApplicationId } from "../../../../../tanstack/query/getApplicationDocuments";
import { saveStepProgress } from "../../../../../Redux/Slice/applicationSlice";
import getSweetAlert from "../../../../../util/alert/sweetAlert";
import { addActivity } from "../../../../../Redux/Slice/activitySlice";

export default function Step5Review({ onNext, onBack, onEdit, user_id, application_id }) {
  const dispatch = useDispatch();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showConfirmError, setShowConfirmError] = useState(false);
  const { isApplicationLoading, documents: documentsData, isApplicationError } = useSelector(state => state.application);

  const { data: personalInfo, isLoading: isApplicationDataLoading, error: isApplicationSDataError } = usePersonalInfoByApplicationId(application_id);
  const { data: passport, isLoading: isPassportDataLoading, error: isPassportDataError } = usePassportByApplicationId(application_id);
  const { data: documents, isLoading: isDocumentDataLoading, error: isDocumentDataError } = useDocumentsByApplicationId(application_id);
  const { data: visaData, isLoading: isVisaDataLoading, error: isVisaDataError } = useVisaDetailsByApplicationId(application_id);

  const handleProceed = async () => {
    if (!isConfirmed) {
      setShowConfirmError(true);
      setTimeout(() => setShowConfirmError(false), 3000);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    const application_obj = {
      step: 6,
      completedSteps: [1, 2, 3, 4, 5]
    }

    const activity_obj = {
      title: 'Payment pending',
      icon: 'pending'
    }

    dispatch(saveStepProgress({ applicationId: application_id, ...application_obj }))
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
    onNext();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDaysUntilExpiry = () => {
    if (!passport?.expiryDate) return null;
    const expiry = new Date(passport.expiryDate);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiry = calculateDaysUntilExpiry();

  const InfoSection = ({ title, icon: Icon, children, onEditClick, step }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md">
            <Icon className="text-white" size={22} strokeWidth={2.5} />
          </div>
          <h4 className="text-lg font-bold text-gray-900">{title}</h4>
        </div>
        {onEditClick && (
          <button
            type="button"
            onClick={() => onEditClick(step)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:text-white hover:bg-red-600 font-semibold rounded-lg transition-all duration-200 border-2 border-red-200 hover:border-red-600"
          >
            <Edit2 size={14} strokeWidth={2.5} />
            Edit
          </button>
        )}
      </div>
      {children}
    </div>
  );

  const InfoRow = ({ icon: Icon, label, value, highlight }) => (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <Icon className="text-gray-400 flex-shrink-0 mt-1" size={18} strokeWidth={2.5} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{label}</p>
        <p className={`text-base font-semibold ${highlight ? 'text-red-600' : 'text-gray-900'} break-words`}>
          {value || "—"}
        </p>
      </div>
    </div>
  );

  const visaDocs = [
    { name: visaData?.document1_name, url: visaData?.document1_path },
    { name: visaData?.document2_name, url: visaData?.document2_path },
    { name: visaData?.document3_name, url: visaData?.document3_path },
    { name: visaData?.document4_name, url: visaData?.document4_path },
    { name: visaData?.document5_name, url: visaData?.document5_path },
  ];

  // console.log('Personal Info retrive',personalInfo);
  // console.log('Passport details retrive', passport);
  // console.log('Visa data retrive', visaData);
  // console.log('Document data retrive', documents);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-200">
            <CheckCircle className="text-white" size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Review & Confirm
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">Please review all information before proceeding to payment</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <InfoSection
          title="Personal Information"
          icon={User}
          onEditClick={onEdit}
          step={1}
        >
          <div className="space-y-1">
            <InfoRow
              icon={User}
              label="First Name"
              value={personalInfo?.first_name}
            />
            <InfoRow
              icon={User}
              label="Last Name"
              value={personalInfo?.last_name}
            />
            <InfoRow
              icon={Calendar}
              label="Date of Birth"
              value={formatDate(personalInfo?.date_of_birth)}
            />
            <InfoRow
              icon={Globe}
              label="Nationality"
              value={personalInfo?.nationality}
            />
            <InfoRow
              icon={Mail}
              label="Email Address"
              value={personalInfo?.email}
            />
            <InfoRow
              icon={Phone}
              label="Phone Number"
              value={personalInfo?.phone}
            />
          </div>
        </InfoSection>

        {/* Address Information */}
        <InfoSection
          title="Address Information"
          icon={Home}
          onEditClick={onEdit}
          step={1}
        >
          <div className="space-y-1">
            <InfoRow
              icon={MapPin}
              label="Street Address"
              value={personalInfo?.address}
            />
            <InfoRow
              icon={MapPin}
              label="City"
              value={personalInfo?.city}
            />
            <InfoRow
              icon={MapPin}
              label="Postal Code"
              value={personalInfo?.postal_code}
            />
          </div>
        </InfoSection>

        {/* Passport Details */}
        <InfoSection
          title="Passport Details"
          icon={CreditCard}
          onEditClick={onEdit}
          step={2}
        >
          <div className="space-y-1">
            <InfoRow
              icon={FileText}
              label="Passport Number"
              value={passport?.passport_number}
            />
            <InfoRow
              icon={MapPin}
              label="Place of Issue"
              value={passport?.place_of_issue}
            />
            <InfoRow
              icon={Calendar}
              label="Issue Date"
              value={formatDate(passport?.issue_date)}
            />
            <InfoRow
              icon={Calendar}
              label="Expiry Date"
              value={formatDate(passport?.expiry_date)}
              highlight={daysUntilExpiry && daysUntilExpiry < 180}
            />
          </div>

          {daysUntilExpiry && (
            <div className={`mt-5 p-4 rounded-xl border-2 ${daysUntilExpiry < 180
              ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300'
              : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
              }`}>
              <p className={`text-sm font-semibold ${daysUntilExpiry < 180 ? 'text-red-800' : 'text-green-800'
                }`}>
                {daysUntilExpiry < 180 ? '⚠️ ' : '✓ '}
                Passport valid for <span className="font-bold">{daysUntilExpiry} days</span>
                (<span className="font-bold">{Math.floor(daysUntilExpiry / 30)} months</span>)
              </p>
            </div>
          )}
        </InfoSection>

        {/* Visa Details */}
        <InfoSection
          title="Visa Details"
          icon={Briefcase}
          onEditClick={onEdit}
          step={3}
        >
          <div className="space-y-1">
            <InfoRow
              icon={FileTypeCorner}
              label="Visa Type"
              value={visaData?.visa_type}
            />
            <InfoRow
              icon={BaggageClaim}
              label="Purpose"
              value={visaData?.purpose}
            />
          </div>
          <div className="space-y-4 mt-5">
            {visaDocs.map((doc, i) => {
              if (!doc?.name) return null;

              const isPdf = doc.name.endsWith(".pdf");
              const Icon = isPdf ? FileText : Image;
              const colorClass = isPdf ? "text-blue-600" : "text-red-600";

              return (
                <div key={i}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon className={colorClass} size={26} strokeWidth={2.5} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                      {`Document ${i + 1}`}
                    </p>

                    <p className="text-sm font-bold text-gray-900 truncate">
                      {doc?.name?.split("_").slice(1).join("_")}
                    </p>
                  </div>

                  {doc?.name && (
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={22} strokeWidth={2.5} />
                  )}
                </div>
              );
            })}

          </div>
        </InfoSection>

        {/* Uploaded Documents */}
        <InfoSection
          title="Uploaded Documents"
          icon={FileText}
          onEditClick={onEdit}
          step={4}
        >
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <FileText className="text-red-600" size={26} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Passport Copy</p>
                <p className="text-sm font-bold text-gray-900 truncate">
                  {documents?.passport_name?.split("_")?.slice(1)?.join("_") || "Not uploaded"}
                </p>
              </div>
              {documents?.passport_name && (
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={22} strokeWidth={2.5} />
              )}
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <User className="text-blue-600" size={26} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Passport Photo</p>
                <p className="text-sm font-bold text-gray-900 truncate">
                  {documents?.photo_name?.split("_")?.slice(1)?.join("_") || "Not uploaded"}
                </p>
              </div>
              {documents?.photo_name && (
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={22} strokeWidth={2.5} />
              )}
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Landmark className="text-blue-600" size={26} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Bank Statement</p>
                <p className="text-sm font-bold text-gray-900 truncate">
                  {documents?.bank_statement_name?.split("_")?.slice(1)?.join("_") || "Not uploaded"}
                </p>
              </div>
              {documents?.bank_statement_name && (
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={22} strokeWidth={2.5} />
              )}
            </div>
          </div>
        </InfoSection>

        {/* Confirmation Checkbox */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-2xl p-6 shadow-lg">
          <label className="flex items-start gap-4 cursor-pointer group">
            <div className="relative flex items-center pt-0.5">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="w-6 h-6 text-red-600 border-2 border-gray-400 rounded-md focus:ring-2 focus:ring-red-500 cursor-pointer transition-all"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="text-red-600" size={20} strokeWidth={2.5} />
                <p className="text-base font-bold text-gray-900 group-hover:text-gray-700">
                  I confirm that all information is accurate and complete
                </p>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                By checking this box, I declare that all details provided are correct to the best of my knowledge.
                I understand that providing false information may result in visa rejection and potential legal consequences.
              </p>
            </div>
          </label>

          {showConfirmError && !isConfirmed && (
            <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl flex items-start gap-3 animate-slideDown">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} strokeWidth={2.5} />
              <p className="text-sm font-semibold text-red-800">
                Please confirm that all information is correct before proceeding to payment
              </p>
            </div>
          )}
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm">
              <p className="font-bold text-blue-900 mb-1">Before proceeding to payment</p>
              <ul className="text-blue-800 space-y-1">
                <li>• Review all information carefully for accuracy</li>
                <li>• Ensure all documents are clearly visible and valid</li>
                <li>• Verify passport validity meets the 6-month requirement</li>
                <li>• Changes after payment may incur additional fees</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <StepButtons
          onBack={onBack}
          onNext={handleProceed}
          nextLabel="Proceed to Payment"
          backLabel="Back to Documents"
          isLoading={isApplicationLoading}
          disabled={!isConfirmed}
        />
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}