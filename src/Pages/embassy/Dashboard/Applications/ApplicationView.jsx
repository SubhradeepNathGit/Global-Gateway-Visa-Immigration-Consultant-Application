import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { decodeBase64Url } from "../../../../util/encodeDecode/base64";
import ApplicationViewHeader from "../../../../Components/embassy/dashboard/application-view/ApplicationViewHeader";
import StatusCard from "../../../../Components/embassy/dashboard/application-view/StatusCard";
import AppointmentModal from "../../../../Components/embassy/dashboard/application-view/application-modal/AppointmentModal";
import RejectModal from "../../../../Components/embassy/dashboard/application-view/application-modal/RejectModal";
import ApplicationViewTab from "../../../../Components/embassy/dashboard/application-view/application-view-details/ApplicationViewTab";
import PersonalInfo from "../../../../Components/embassy/dashboard/application-view/application-view-details/PersonalInfo";
import VisaDetails from "../../../../Components/embassy/dashboard/application-view/application-view-details/VisaDetails";
import Documents from "../../../../Components/embassy/dashboard/application-view/application-view-details/Documents";
import TimeLine from "../../../../Components/embassy/dashboard/application-view/application-view-details/TimeLine";
import { useVisaDetails } from "../../../../tanstack/query/getSpecificVisaDetails";
import { useFulfilledApplicationByUser } from "../../../../tanstack/query/getUserTravelHistory";
import { useFullApplicationDetailsById } from "../../../../tanstack/query/getFullApplicationDetails";
import { useSelector } from "react-redux";

export default function ApplicationView() {
  const { application_id } = useParams();
  const applicationId = decodeBase64Url(application_id);

  const [activeTab, setActiveTab] = useState("personal");
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointmentSet, setAppointmentSet] = useState(false);

  const { isuserLoading, userAuthData, userError } = useSelector(state => state.checkAuth);
  const { isEmbassyLoading, embassyData, hasEmbassyerror } = useSelector(state => state.embassy);

  const { data: rawApplication, isLoading: applicationLoading } = useFullApplicationDetailsById(applicationId);

  const { data: visaDetails } = useVisaDetails({
    country_id: rawApplication?.country_id,
    visa_id: rawApplication?.application_visa_details?.visaId,
  });

  const { data: travelHistoryDetails } =
    useFulfilledApplicationByUser(rawApplication?.user_id, "fulfilled");

  const application = useMemo(() => {
    if (!rawApplication) return null;

    const destinationCountry =
      visaDetails?.country_name ||
      visaDetails?.country?.name ||
      visaDetails?.country ||
      embassyData?.country_name || null;

    return {
      ...rawApplication,
      destinationCountry,
    };
  }, [rawApplication, visaDetails]);

  // console.log('User data', userAuthData);
  // console.log('Embassy data', embassyData);

  if (applicationLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-transparent">
        <div className="w-18 h-18 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <span className="mt-5 text-black">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <ApplicationViewHeader application={application} />

      {/* Status Card */}
      <StatusCard
        application={application}
        setShowRejectModal={setShowRejectModal}
        setShowAppointmentModal={setShowAppointmentModal}
      />

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <ApplicationViewTab
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="p-6">
          {activeTab === "personal" && (
            <PersonalInfo application={application} />
          )}

          {activeTab === "visa" && (
            <VisaDetails
              application={application}
              visaDetails={visaDetails}
              travelHistoryDetails={travelHistoryDetails}
            />
          )}

          {activeTab === "documents" && (
            <Documents application={application} />
          )}

          {activeTab === "timeline" && (
            <TimeLine application={application} />
          )}
        </div>
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4 z-50">
          <AppointmentModal
            application={application}
            visaDetails={visaDetails}
            currentCountry={embassyData?.country_name}
            setShowAppointmentModal={setShowAppointmentModal}
            setAppointmentSet={setAppointmentSet}
            setSelectedDate={setSelectedDate}
            setSelectedTime={setSelectedTime}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            setCurrentMonth={setCurrentMonth}
            currentMonth={currentMonth}
            embassyId={embassyData?.id}
            country_id={embassyData?.country_id}
          />
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4 z-50">
          <RejectModal
            application={application}
            setShowRejectModal={setShowRejectModal}
          />
        </div>
      )}
    </div>
  );
}