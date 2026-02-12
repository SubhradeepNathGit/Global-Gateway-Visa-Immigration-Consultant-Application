// dd-mm-yy format
export const formatDateDDMMYY = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
};


// dd-mm-yyyy format
export const formatDateDDMMYYYY = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};


// dd-mm-yyyy hh:mm format
export const formatDateDDMMYYYYHHMM = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
};


// dd/mm/yyyy, hh:mm:ss AM format
export const formatDateTimeMeridian = (dateString) => {
    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
};


// dd/mm/yyyy at  hh:mm AM format
export const formatDateTimeMeridianWithoutSecond = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    const options = {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    };

    const formatted = new Intl.DateTimeFormat("en-IN", options).format(date);

    return formatted.replace(",", " at");
};


// yyyy format 
export const getYear = (dateString) => {
    if (!dateString) return "N/A";

    return new Date(dateString).getFullYear();
}


// ISO format
export const buildISOFormat = (date, time) => {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const appointment = new Date(date);
    appointment.setHours(hours, minutes, 0, 0);

    return appointment.toISOString();
};


// seperate date and time and return with meridian
export const getDateAndTimeFromISO = (isoString) => {
    const date = new Date(isoString);

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;

    return {
        selectedDate: date,
        selectedTime: `${displayHour}:${minutes} ${period}`,
    };
};


// Time → 12-hour format & Date → "Dec 20"
export const formatAppointmentDateTime = (dateTimeString) => {
    if (!dateTimeString) return { time: "", date: "" };

    const date = new Date(dateTimeString);

    const time = date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit"
    });

    return {
        time,
        date: formattedDate
    };
};


// Time → 12-hour format & Date → "Dec 20"
export const formatAppointmentDateTimeWithYear = (dateTimeString) => {
    if (!dateTimeString) return { time: "", date: "" };

    const date = new Date(dateTimeString);

    const time = date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit"
    });

    return {
        time,
        date: formattedDate
    };
};


// "January 12, 2026, 09:34 PM" format
export function formatTransactionDate(dateStr) {
    if (!dateStr) return "N/A";

    let parsedDate;
    try {
        if (dateStr.includes(" at")) {
            parsedDate = new Date(dateStr.replace(" at", ""));
        } else {
            parsedDate = new Date(dateStr);
        }

        if (isNaN(parsedDate)) return "N/A";

        return parsedDate.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch (err) {
        return "N/A";
    }
}


//  Jan 13, 2026
export const formatDate = (date, options = { month: 'short', day: 'numeric', year: 'numeric' }) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate)) return "Invalid date";

    return parsedDate.toLocaleDateString('en-US', options);
};
