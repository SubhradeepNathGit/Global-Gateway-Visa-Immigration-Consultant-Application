import supabase from "../util/Supabase/supabase";

export async function fetchMonthlyApplicationStats() {
    const { data, error } = await supabase.from("applications").select(`created_at`);

    if (error) throw new Error(error.message);

    const currentYear = new Date().getFullYear();
    const prevYear = currentYear - 1;

    // Initialize 12 months for both years
    const currentYearData = Array(12).fill(0);
    const prevYearData = Array(12).fill(0);

    data.forEach((app) => {
        const date = new Date(app.created_at);
        const year = date.getFullYear();
        const monthIndex = date.getMonth(); 

        if (year === currentYear) {
            currentYearData[monthIndex]++;
        }
        if (year === prevYear) {
            prevYearData[monthIndex]++;
        }
    });

    return { currentYear, prevYear, currentYearData, prevYearData, };
}