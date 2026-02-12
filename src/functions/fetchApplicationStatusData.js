import supabase from "../util/Supabase/supabase";

const STATUS_COLORS = {
    approved: "#10b981",
    processing: "#f59e0b",
    pending: "#3b82f6",
    rejected: "#ef4444",
    "awaiting interview": "#8b5cf6",
};

export async function fetchApplicationStatusData() {
    const { data, error } = await supabase.from("applications").select("status, appointment_date");

    if (error) throw error;

    const stats = {};

    data.forEach(app => {
        // normalize status
        let finalStatus = app.status || "pending";

        // business rule
        if (finalStatus.toLowerCase() === "processing" && app.appointment_date) {
            finalStatus = "awaiting interview";
        }

        if (!stats[finalStatus]) {
            stats[finalStatus] = {
                name: formatStatus(finalStatus),
                value: 0,
                color: STATUS_COLORS[finalStatus.toLowerCase()] || "#9ca3af",
            };
        }

        stats[finalStatus].value += 1;
    });

    return Object.values(stats);
}

// helper
function formatStatus(status) {
    return status
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
