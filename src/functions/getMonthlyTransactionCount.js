import supabase from "../util/Supabase/supabase";

export async function getMonthlyTransactionCount() {
    const res = await supabase.from("transaction_details").select("created_at, status");
    // console.log('Response for getting monthly transaction count', res);

    if (res?.error) throw res?.error;

    const grouped = {};

    res?.data.forEach((row) => {
        const month = new Date(row.created_at).toISOString().slice(0, 7);

        if (!grouped[month]) grouped[month] = 0;
        grouped[month] += 1;
    });

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
            total_transactions: current,
            previous_month: previous,
            difference,
            percentage_change: percentage,
            trend:
                difference > 0
                    ? "up"
                    : difference < 0
                        ? "down"
                        : "same"
        });
    });

    return result;
}