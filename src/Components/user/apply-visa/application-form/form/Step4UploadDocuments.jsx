import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import FileInput from "../FileInput";
import StepButtons from "../StepButtons"
import { saveStepDocuments, saveStepProgress } from "../../../../../Redux/Slice/applicationSlice";
import getSweetAlert from "../../../../../util/alert/sweetAlert";
import { useDocumentsByApplicationId } from "../../../../../tanstack/query/getApplicationDocuments";
import { addActivity } from "../../../../../Redux/Slice/activitySlice";

export default function Step4UploadDocuments({ onNext, onBack, user_id, application_id }) {
  const dispatch = useDispatch();
  const { isApplicationLoading, documents, isApplicationError } = useSelector(state => state.application);
  const { data: documentData, isLoading: isDocumentDataLoading, error: isDocumentDataError } = useDocumentsByApplicationId(application_id);

  const [passportFile, setPassportFileLocal] = useState(documentData?.passportFile || null);
  const [photoFile, setPhotoFileLocal] = useState(documentData?.photoFile || null);
  const [bankStatementFile, setBankStatementFileLocal] = useState(documentData?.bankStatementFile || null);
  const [passportPreview, setPassportPreview] = useState(documentData?.passportPreview || null);
  const [photoPreview, setPhotoPreview] = useState(documentData?.photoPreview || null);
  const [bankStatementPreview, setBankStatementPreview] = useState(documentData?.bankStatementPreview || null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (passportFile instanceof File) {
      const url = URL.createObjectURL(passportFile);
      setPassportPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [passportFile]);

  useEffect(() => {
    if (photoFile instanceof File) {
      const url = URL.createObjectURL(photoFile);
      setPhotoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [photoFile]);

  useEffect(() => {
    if (bankStatementFile instanceof File) {
      const url = URL.createObjectURL(bankStatementFile);
      setBankStatementPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [bankStatementFile]);

  const validateFile = (file, type) => {
    const maxSize = type === 'passport' ? 600 * 1024 : type === 'bankStatement' ? 500 * 1024 : 400 * 1024;
    const allowedTypes = type === 'passport' || type === 'bankStatement'
      ? ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      : ['image/jpeg', 'image/jpg', 'image/png'];

    if (!file) {
      return `${type === 'passport' ? 'Passport document' : type === 'bankStatement' ? 'Bank statement' : 'Photo'} is required`;
    }

    if (file.size > maxSize) {
      return `File size must be less than ${maxSize / 1024}KB`;
    }

    if (!allowedTypes.includes(file.type)) {
      return type === 'passport' || type === 'bankStatement'
        ? 'Only JPG, PNG, JPEG, or PDF files are allowed'
        : 'Only JPG, JPEG or PNG files are allowed';
    }

    return null;
  };

  useEffect(() => {
    if (!documentData) return;

    const parseUrl = (value) => {
      if (!value) return null;

      try {
        const parsed = JSON.parse(value);
        return parsed.publicUrl || parsed.url || null;
      } catch {
        return value;
      }
    };

    const passportUrl = parseUrl(documentData.passport_file);
    const photoUrl = parseUrl(documentData.photo_file);
    const bankStatementUrl = parseUrl(documentData.bank_statement_file);

    if (passportUrl) {
      setPassportFileLocal({
        file: { url: passportUrl },
        url: passportUrl,
        isOld: true,
        docName: documentData.passport_name,
      });
      setPassportPreview(passportUrl);
    }

    if (photoUrl) {
      setPhotoFileLocal({
        file: { url: photoUrl },
        url: photoUrl,
        isOld: true,
        docName: documentData.photo_name,
      });
      setPhotoPreview(photoUrl);
    }

    if (bankStatementUrl) {
      setBankStatementFileLocal({
        file: { url: bankStatementUrl },
        url: bankStatementUrl,
        isOld: true,
        docName: documentData.bank_statement_name,
      });
      setBankStatementPreview(bankStatementUrl);
    }
  }, [documentData]);

  // console.log('Document data retrive', documentData);

  const handlePassportChange = (file) => {
    if (file === null) {
      setPassportFileLocal(null);
      setPassportPreview(null);
      return;
    }

    const error = validateFile(file, 'passport');
    if (error) {
      setErrors(prev => ({ ...prev, passport: error }));
      return;
    }

    setErrors(prev => ({ ...prev, passport: null }));
    setPassportFileLocal({ file, isOld: false });
  };

  const handlePhotoChange = (file) => {
    if (file === null) {
      setPhotoFileLocal(null);
      setPhotoPreview(null);
      return;
    }

    const error = validateFile(file, 'photo');
    if (error) {
      setErrors(prev => ({ ...prev, photo: error }));
      return;
    }

    setErrors(prev => ({ ...prev, photo: null }));
    setPhotoFileLocal({ file, isOld: false });
  };

  const handleBankStatementChange = (file) => {
    if (file === null) {
      setBankStatementFileLocal(null);
      setBankStatementPreview(null);
      return;
    }

    const error = validateFile(file, 'bankStatement');
    if (error) {
      setErrors(prev => ({ ...prev, bankStatement: error }));
      return;
    }

    setErrors(prev => ({ ...prev, bankStatement: null }));
    setBankStatementFileLocal({ file, isOld: false });
  };

  const submit = async () => {
    const passportError = passportFile?.isOld ? null : validateFile(passportFile.file, 'passport');
    const photoError = photoFile?.isOld ? null : validateFile(photoFile.file, 'photo');
    const bankStatementError = bankStatementFile?.isOld ? null : validateFile(bankStatementFile.file, 'bankStatement');

    if (passportError || photoError || bankStatementError) {
      setErrors({
        passport: passportError,
        photo: photoError,
        bankStatement: bankStatementError
      });
      return;
    }

    const application_obj = {
      step: 5,
      completedSteps: [1, 2, 3, 4]
    }

    const activity_obj = {
      title: 'Application under review',
      icon: 'review'
    }

    // console.log('Received document details', passportFile, photoFile, bankStatementFile);

    dispatch(saveStepDocuments({ applicationId: application_id, payload: { passportFile, photoFile, bankStatementFile } }))
      .then(res => {
        // console.log('Response for uploading document', res);

        if (res.meta.requestStatus === "fulfilled") {
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
        }
        else {
          getSweetAlert('Oops...', 'Something went wrong!', 'info');
        }
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  };

  const completedCount = [passportFile, photoFile, bankStatementFile].filter(Boolean).length;
  const totalCount = 3;
  const allUploaded = completedCount === totalCount;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-200">
            <Upload className="text-white" size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Upload Documents
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">Upload clear copies of your required documents</p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="space-y-6">
        {/* Document Upload Cards */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText size={20} className="text-red-600" strokeWidth={2.5} />
            Required Documents
          </h3>

          <div className="space-y-6">
            <FileInput
              label="Passport Bio-Data Page"
              description="Upload a clear scan or photo of your passport bio-data page (the page with your photo)"
              onFileChange={handlePassportChange}
              accept="image/*,application/pdf"
              previewUrl={passportPreview}
              noChange={passportFile?.isOld}
              file={passportFile}
              error={errors.passport}
              maxSize="600KB"
              required
            />

            <FileInput
              label="Passport-Size Photograph"
              description="Recent color photograph with white background (35mm x 45mm, taken within last 6 months)"
              onFileChange={handlePhotoChange}
              accept="image/*"
              previewUrl={photoPreview}
              noChange={photoFile?.isOld}
              file={photoFile}
              error={errors.photo}
              maxSize="400KB"
              required
            />

            <FileInput
              label="Bank Statement"
              description="Upload your bank statement for the last 3-6 months showing sufficient funds"
              onFileChange={handleBankStatementChange}
              accept="image/*,application/pdf"
              previewUrl={bankStatementPreview}
              noChange={bankStatementFile?.isOld}
              file={bankStatementFile}
              error={errors.bankStatement}
              maxSize="500KB"
              required
            />
          </div>
        </div>

        {/* Upload Progress Card */}
        {(passportFile || photoFile || bankStatementFile) && (
          <div className={`rounded-2xl shadow-lg border-2 p-6 transition-all duration-500 ${allUploaded
            ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300"
            : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300"
            }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${allUploaded ? "bg-green-100" : "bg-blue-100"
                }`}>
                {allUploaded ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" strokeWidth={2.5} />
                ) : (
                  <Upload className="w-6 h-6 text-blue-600" strokeWidth={2.5} />
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-bold mb-2 text-base ${allUploaded ? "text-green-900" : "text-blue-900"
                  }`}>
                  {allUploaded ? "All Documents Uploaded ✓" : "Upload Progress"}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={allUploaded ? "text-green-800" : "text-blue-800"}>
                      Passport Copy
                    </span>
                    <span className={`font-semibold ${passportFile ? "text-green-600" : "text-gray-400"
                      }`}>
                      {passportFile ? "✓ Uploaded" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={allUploaded ? "text-green-800" : "text-blue-800"}>
                      Passport Photo
                    </span>
                    <span className={`font-semibold ${photoFile ? "text-green-600" : "text-gray-400"
                      }`}>
                      {photoFile ? "✓ Uploaded" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={allUploaded ? "text-green-800" : "text-blue-800"}>
                      Bank Statement
                    </span>
                    <span className={`font-semibold ${bankStatementFile ? "text-green-600" : "text-gray-400"
                      }`}>
                      {bankStatementFile ? "✓ Uploaded" : "Pending"}
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={allUploaded ? "text-green-700" : "text-blue-700"}>
                      {completedCount} of {totalCount} completed
                    </span>
                    <span className={`font-bold ${allUploaded ? "text-green-700" : "text-blue-700"}`}>
                      {Math.round((completedCount / totalCount) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${allUploaded
                        ? "bg-gradient-to-r from-green-500 to-green-600"
                        : "bg-gradient-to-r from-blue-500 to-blue-600"
                        }`}
                      style={{ width: `${(completedCount / totalCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Requirements Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm">
              <p className="font-bold text-blue-900 mb-1">Document Requirements</p>
              <ul className="text-blue-800 space-y-1">
                <li>• All documents must be clear and fully visible</li>
                <li>• Photo must have white background, no glasses or hats</li>
                <li>• Passport copy must show all four corners and text clearly</li>
                <li>• Bank statement should show transactions for last 3-6 months</li>
                <li>• Documents should not be older than 6 months</li>
                <li>• Ensure proper lighting with no shadows or glare</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <StepButtons
          onBack={onBack}
          onNext={submit}
          nextLabel="Continue to Review"
          backLabel="Back to Visa Details"
          isLoading={isApplicationLoading}
          disabled={!allUploaded}
        />
      </div>
    </div>
  );
}