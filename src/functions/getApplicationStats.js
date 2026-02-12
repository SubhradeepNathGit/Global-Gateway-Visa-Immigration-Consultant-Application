import supabase from "../util/Supabase/supabase";

export async function getApplicationStats() {
    const { data, error } = await supabase.from("applications").select("created_at");

    if (error) throw error;

    // Total applications
    const totalApplications = data.length;

    const now = new Date();
    const currentMonth = now.getMonth();   
    const currentYear = now.getFullYear();

    // Track current month + previous month counts
    let currentMonthCount = 0;
    let previousMonthCount = 0;

    data.forEach((item) => {
        const created = new Date(item.created_at);
        const month = created.getMonth();
        const year = created.getFullYear();

        if (year === currentYear && month === currentMonth) {
            currentMonthCount++;
        }

        // handle Jan → previous month is Dec of previous year
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        if (year === prevYear && month === prevMonth) {
            previousMonthCount++;
        }
    });

    // Calculate increment / decrement rate
    let rate = 0;

    if (previousMonthCount === 0) {
        rate = currentMonthCount > 0 ? 100 : 0;
    } else {
        rate = ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
    }

    return {
        totalApplications,
        currentMonthCount,
        previousMonthCount,
        rate: Number(rate.toFixed(2)),
        isIncrease: rate >= 0
    };
}
