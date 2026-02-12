import supabase from "../util/Supabase/supabase";

export async function getApplicationStatusStats(country_id) {

    let query = supabase.from("applications").select("id, created_at, status").order("created_at", { ascending: true });

    // Apply filter only if country_id is provided
    if (country_id != null) {
        query = query.eq("country_id", country_id);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Group by month for any status
    const groupByMonth = (rows) => {
        const monthCount = {};
        rows.forEach((item) => {
            const month = item.created_at.slice(0, 7); // "YYYY-MM"
            monthCount[month] = (monthCount[month] || 0) + 1;
        });
        return monthCount;
    };

    // Approved data
    const approved = data.filter((item) => item.status == "approved");
    const approvedMonthCount = groupByMonth(approved);

    // Rejected data
    const rejected = data.filter((item) => item.status == "rejected");
    const rejectedMonthCount = groupByMonth(rejected);

    // All applications
    const total = data.length;

    // Calculate month-over-month logic safely
    const rateCalc = (map) => {
        const months = Object.keys(map).sort();
        const lastMonth = months[months.length - 1];
        const prevMonth = months[months.length - 2];

        const curr = map[lastMonth] || 0;
        const prev = map[prevMonth] || 0;

        const diff = curr - prev;

        const rate = prev === 0 ? 100 : Math.round((diff / prev) * 100);

        return {
            current: curr,
            previous: prev,
            rate: Math.abs(rate),
            isIncrease: diff >= 0,
        };
    };

    return {
        approvedStats: {
            totalApproved: approved.length,
            ...rateCalc(approvedMonthCount),
        },

        rejectedStats: {
            totalRejected: rejected.length,
            ...rateCalc(rejectedMonthCount),
        },

        successRate: total === 0 ? 0 : Math.round((approved.length / total) * 100),
    };
}