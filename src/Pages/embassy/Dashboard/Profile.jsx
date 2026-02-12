import React, { useEffect, useState } from "react";
import { Camera, CheckCircle, AlertCircle, Award, Shield, FileCheck, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import ProfileSection from "../../../Components/embassy/dashboard/profile/hero-section/ProfileSection";
import ActionBtn from "../../../Components/embassy/dashboard/profile/hero-section/ActionBtn";
import StatsCard from "../../../Components/embassy/dashboard/profile/StatsCard";
import AchievementSection from "../../../Components/embassy/dashboard/profile/AchievementSection";
import ContactDetails from "../../../Components/embassy/dashboard/profile/ContactDetails";
import AdditionalInformation from "../../../Components/embassy/dashboard/profile/AdditionalInformation";
import { useDispatch, useSelector } from "react-redux";
import { useFullCountryDetails } from "../../../tanstack/query/getCountryDetails";
import { useApplicationStats } from "../../../tanstack/query/getApplicationStatsForEmbassy";
import { useApplicationsByCountryId } from "../../../tanstack/query/getApplicationsByCountryId";
import { getMonthlyChange } from "../../../util/embassy-stats/calcMonthlyChange";
import hotToast from "../../../util/alert/hot-toast";
import getSweetAlert from "../../../util/alert/sweetAlert";
import { fetchEmbassyById, updateEmbassyById } from "../../../Redux/Slice/embassySlice";
import { useCountryVisas } from "../../../tanstack/query/getCountryVisas";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const dispatch = useDispatch();

  const { embassyData } = useSelector(state => state.embassy);
  const { data: countryDetails } = useFullCountryDetails(embassyData?.country_id);
  const { data: allTypeApplications } = useApplicationsByCountryId(embassyData?.country_id, "all");
  const { data: processingTypeApplications } = useApplicationsByCountryId(embassyData?.country_id, "processing");

  const { data: allStats = [] } = useApplicationStats({ countryId: embassyData?.country_id, statusFilter: "all" });
  const { data: processingStats = [] } = useApplicationStats({ countryId: embassyData?.country_id, statusFilter: "processing" });

  const totalChange = getMonthlyChange(allStats);
  const processingChange = getMonthlyChange(processingStats);

  const { data, isLoading, isError } = useCountryVisas(embassyData?.country_id);

  // Map all visa types dynamically
  const visaWithDays = data?.visas?.map(visa => ({
    type: visa.type,
    days: Number(visa.days) || 0,
  }));

  const totalProcessingTime = visaWithDays?.reduce((sum, visa) => sum + visa.days, 0);
  const avgProcessingTime = totalProcessingTime > 0 ? Number(totalProcessingTime / data?.visas?.length)?.toFixed(0) : 0;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      phone: "",
      physicalAddress: "",
      website: ""
    }
  });

  useEffect(() => {
    if (embassyData) {
      reset({
        phone: embassyData.contact_no || "",
        physicalAddress: embassyData.address || "",
        website: embassyData.website_url || ""
      });
    }
  }, [embassyData, reset]);

  const onSubmit = async (data) => {
    // console.log("FORM DATA:", data);

    let updateData = {
      ...embassyData,
      address: data?.physicalAddress,
      contact_no: data?.phone,
      website_url: data?.website
    }

    if (coverPhoto) {
      // console.log("Upload cover photo:", coverPhoto.file);
      updateData = {
        ...updateData,
        coverPhoto: { file: coverPhoto.file, isOld: false }
      }
    }

    dispatch(updateEmbassyById({ id: embassyData?.id, updateData }))
      .then(res => {
        // console.log('Response for updating embassy contact details', res);

        if (res.meta.requestStatus === "fulfilled") {
          hotToast("Profile updated successfully", "success");
          dispatch(fetchEmbassyById(embassyData?.id));
        } else {
          getSweetAlert("Oops...", "Something went wrong!", "error");
        }

      }).catch(err => {
        getSweetAlert("Oops...", "Something went wrong!", "error");
      })

    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
    setCoverPhoto(null);
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      hotToast("Only JPG, JPEG, and PNG files are allowed", "error");
      return;
    }

    if (!file.type.startsWith("image/")) {
      hotToast("Please select an image file", "error");
      return;
    }

    if (file.size > 500 * 1024) {
      hotToast("File size must be less than 5KB", "error");
      return;
    }

    const preview = URL.createObjectURL(file);
    setCoverPhoto({ file, preview });
  };

  const stats = [
    {
      icon: CheckCircle,
      label: "Applications Processed",
      value: allTypeApplications?.length ?? 0,
      change: totalChange?.trend,
      changeType: totalChange?.changeText,
      bgColor: "bg-blue-50",
      iconColor: "bg-blue-100 text-blue-600",
      textColor: "text-blue-600"
    },
    {
      icon: Clock,
      label: "Average Processing Time",
      value: avgProcessingTime + `${avgProcessingTime > 1 ? ' days' : ' day'}`,
      change: "5 days",
      changeType: "positive",
      bgColor: "bg-green-50",
      iconColor: "bg-green-100 text-green-600",
      textColor: "text-green-600"
    },
    {
      icon: AlertCircle,
      label: "Pending Reviews",
      value: processingTypeApplications?.length ?? 0,
      change: processingChange?.trend,
      changeType: processingChange?.changeText,
      bgColor: "bg-yellow-50",
      iconColor: "bg-yellow-100 text-yellow-600",
      textColor: "text-yellow-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---------------- HERO SECTION ---------------- */}
      <div className="relative w-full">
        <div className="relative h-48 sm:h-56 -mt-7 w-full overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-500">
          {coverPhoto ? (
            <img
              src={coverPhoto.preview}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : embassyData?.cover_photo_url ? (
            <img
              src={embassyData?.cover_photo_url}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 opacity-10" />
          )}

          {isEditing && (
            <>
              <input type="file" id="coverPhotoInput" accept="image/*" className="hidden" onChange={handleCoverPhotoChange} />
              <button
                onClick={() =>
                  document.getElementById("coverPhotoInput").click()
                }
                className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 text-white"
              >
                <Camera size={18} />
                Change Cover
              </button>
            </>
          )}

          {/* FORM (Action Buttons) */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <ActionBtn
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              handleCancel={handleCancel}
            />
          </form>
        </div>

        <ProfileSection profileData={countryDetails} />
      </div>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <StatsCard key={idx} stat={stat} />
          ))}
        </div>

        <AchievementSection />

        {/* ---------------- CONTACT CARD ---------------- */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden border-gray-200">
          <div className="bg-gray-50 px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold">Contact Information</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* FORM (Contact Details) */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <ContactDetails isEditing={isEditing} register={register} errors={errors} profileData={embassyData} />
            </form>

            {/* READ ONLY */}
            <AdditionalInformation profileData={embassyData} />
          </div>
        </div>
      </div>
    </div>
  );
}
