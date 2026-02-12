import supabase from "../util/Supabase/supabase";

export async function getPendingApplicationsStats() {
    const { data, error } = await supabase.from("applications").select("id, created_at").eq("status", "pending").eq("status", "processing").order("created_at", { ascending: false });

    if (error) throw error;

    // Total pending
    const totalPending = data.length;

    // Group by month
    const monthCount = {};
    data.forEach((item) => {
        const month = item.created_at.slice(0, 7); 
        monthCount[month] = (monthCount[month] || 0) + 1;
    });

    const months = Object.keys(monthCount).sort();

    const lastMonth = months[months.length - 1];
    const prevMonth = months[months.length - 2];

    const currentCount = monthCount[lastMonth] || 0;
    const prevCount = monthCount[prevMonth] || 0;

    const diff = currentCount - prevCount;
    const rate =
        prevCount === 0 ? 100 : Math.round((diff / prevCount) * 100);

    return {
        totalPending,
        currentMonthPending: currentCount,
        previousMonthPending: prevCount,
        rate: Math.abs(rate),
        isIncrease: diff >= 0,
    };
}
