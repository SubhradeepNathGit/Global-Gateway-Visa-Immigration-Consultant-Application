import supabase from "../util/Supabase/supabase";

export async function getMonthlyRevenue() {
    const res = await supabase.from("transaction_details").select("amount, created_at, status").eq("status", "success");
    // console.log('Response after get total transaction', res);

    if (res?.error) throw res?.error;

    // Group by month
    const grouped = {};

    res?.data.forEach((row) => {
        const month = new Date(row.created_at).toISOString().slice(0, 7);
        const amount = Number(row.amount || 0);

        if (!grouped[month]) grouped[month] = 0;
        grouped[month] += amount;
    });

    // Convert to sorted array
    const months = Object.keys(grouped).sort();
    const result = [];

    months.forEach((month, index) => {
        const current = grouped[month];
        const previous = index > 0 ? grouped[months[index - 1]] : 0;

        const difference = current - previous;
        const percentage =
            previous === 0 ? null : Number(((difference / previous) * 100).toFixed(2));

        result.push({
            month,
            total_revenue: current,
            previous_month: previous,
            difference,
            percentage_change: percentage,
            trend: difference > 0 ? "up" : difference < 0 ? "down" : "same",
        });
    });

    return result;
}