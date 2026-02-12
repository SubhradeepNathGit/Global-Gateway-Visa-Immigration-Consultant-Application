import supabase from "../util/Supabase/supabase";

export async function getBestMonth() {

    const { data, error } = await supabase.from("applications").select(`created_at`);

    if (error) throw error;
    if (!data?.length) return null;

    const counts = {};

    data.forEach((item) => {
        const date = new Date(item.created_at);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`; // YYYY-M
        counts[key] = (counts[key] || 0) + 1;
    });

    const months = Object.keys(counts).sort((a, b) => {
        const [yA, mA] = a.split("-").map(Number);
        const [yB, mB] = b.split("-").map(Number);
        return new Date(yB, mB - 1) - new Date(yA, mA - 1);
    });

    const [currentMonthKey, prevMonthKey] = months;

    const [currentYear, currentMonth] = currentMonthKey.split("-").map(Number);
    const currentMonthCount = counts[currentMonthKey] || 0;
    const prevMonthCount = prevMonthKey ? counts[prevMonthKey] || 0 : 0;

    const increase = prevMonthCount
        ? Math.round(((currentMonthCount - prevMonthCount) / prevMonthCount) * 100)
        : 0;

    const monthName = new Date(currentYear, currentMonth - 1).toLocaleString("default", {
        month: "long",
    });

    return { monthName, currentMonthCount, increase };
}