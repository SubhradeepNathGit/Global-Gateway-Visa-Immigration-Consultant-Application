import React from "react";
import { CheckCircle, Clock } from "lucide-react";
import { formatDateTimeMeridian } from "../../../../../util/dateFormat/dateFormatConvertion";

const TimeLine = ({ application }) => {
    const successPayment = application?.application_payment?.find(
        (p) => p?.status === "success"
    );

    const timeline = [
        {
            action: "Application Pending",
            timestamp: formatDateTimeMeridian(application?.created_at),
            user: `${application?.application_personal_info?.first_name || ""} ${application?.application_personal_info?.last_name || ""}`,
            description: "Application not submitted yet",
            show: !!application?.applied_at,
        },
        {
            action: "Payment Received",
            timestamp: formatDateTimeMeridian(successPayment?.created_at),
            user: "System",
            description: successPayment
                ? `Payment of ${successPayment.amount} ${successPayment.currency} confirmed`
                : "Payment pending",
            show: !!successPayment,
        },
        {
            action: "Application Submitted",
            timestamp: formatDateTimeMeridian(application?.applied_at),
            user: `${application?.application_personal_info?.first_name || ""} ${application?.application_personal_info?.last_name || ""}`,
            description: "Application submitted online",
            show: !!application?.applied_at,
        },
        {
            action: "Under Review",
            timestamp: formatDateTimeMeridian(successPayment?.created_at),
            user: "Embassy Officer",
            description: "Application moved to review queue",
            show: !!successPayment,
        },
        {
            action: "Set Appointment",
            timestamp: formatDateTimeMeridian(application?.previous_appointment_date ? application?.previous_appointment_date : application?.appointment_date),
            user: "Embassy Officer",
            description: "Appointment has been set",
            show: !!application?.appointment_date,
        },
        {
            action: "Set Re-Appointment",
            timestamp: formatDateTimeMeridian(application?.appointment_date),
            user: "Embassy Officer",
            description: "Appointment has been reset",
            show: !!application?.previous_appointment_date,
        },
        {
            action: "Visa Decision",
            timestamp: application?.status === "approved" ? formatDateTimeMeridian(application?.approval_date) : formatDateTimeMeridian(application?.updated_at),
            user: "Embassy Officer",
            description:
                application?.status === "approved"
                    ? "Visa approved"
                    : application?.status === "rejected"
                        ? "Visa rejected"
                        : "Visa under processing",
            show: ["approved", "rejected"].includes(application?.status),
        },
    ];

    const visibleTimeline = timeline.filter((item) => item.show);

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock size={20} className="text-blue-600" />
                Activity Timeline
            </h3>

            <div className="relative">
                {visibleTimeline.map((item, idx) => (
                    <div key={idx} className="flex gap-4 pb-8 last:pb-0">
                        <div className="relative flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center z-10">
                                <CheckCircle size={18} className="text-blue-600" />
                            </div>

                            {idx < visibleTimeline.length - 1 && (
                                <div className="absolute top-10 w-0.5 h-full bg-gray-200" />
                            )}
                        </div>

                        <div className="flex-1 pt-1">
                            <div className="flex items-start justify-between mb-1">
                                <h4 className="font-semibold text-gray-900">
                                    {item.action}
                                </h4>
                                <span className="text-sm text-gray-500">
                                    {item.timestamp}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                                {item.description}
                            </p>
                            <p className="text-xs text-gray-500">
                                By: {item.user}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimeLine;