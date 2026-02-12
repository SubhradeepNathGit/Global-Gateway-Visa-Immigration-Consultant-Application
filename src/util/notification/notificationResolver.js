import { GraduationCap, CreditCard, FileText, Bell, AlertTriangle, ClipboardClock, FileVideoCamera } from "lucide-react";

export const resolveNotificationMeta = (message = "") => {
    const lowerMessage = message.toLowerCase();

    switch (true) {
        case lowerMessage.includes("course purchased"):
        case lowerMessage.includes("enrolled"):
            return {
                title: "Course Update",
                icon: FileVideoCamera,
                type: "course",
            };

        case lowerMessage.includes("certificate for completing"):
            return {
                title: "Certificate Issued",
                icon: GraduationCap,
                type: "course",
            };

        case lowerMessage.includes("visa appointment"):
            return {
                title: "Visa Appointment",
                icon: ClipboardClock,
                type: "course",
            };

        case lowerMessage.includes("payment successful"):
        case lowerMessage.includes("payment failed"):
            return {
                title: "Payment Update",
                icon: CreditCard,
                type: "payment",
            };

        case lowerMessage.includes("visa"):
        case lowerMessage.includes("application"):
            return {
                title: "Application Update",
                icon: FileText,
                type: "application",
            };

        case lowerMessage.includes("failed"):
        case lowerMessage.includes("error"):
            return {
                title: "Action Required",
                icon: AlertTriangle,
                type: "system",
            };

        default:
            return {
                title: "Notification",
                icon: Bell,
                type: "system",
            };
    }
};