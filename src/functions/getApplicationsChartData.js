import supabase from "../util/Supabase/supabase";

export async function getApprovalRateData() {
    const { data, error } = await supabase.from("applications").select("status, created_at");

    if (error) throw error;

    const monthMap = {};

    data.forEach((app) => {
        const month = new Date(app.created_at).toLocaleString("default", { month: "short" }); // "Jan", "Feb", etc.
        if (!monthMap[month]) monthMap[month] = { approved: 0, total: 0 };
        monthMap[month].total += 1;
        if (app.status === "approved") monthMap[month].approved += 1;
    });

    // Prepare labels and values
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const approvalRates = months.map((m) => {
        const item = monthMap[m];
        if (!item) return 0;
        return Math.round((item.approved / item.total) * 100);
    });

    return { months, approvalRates };
}