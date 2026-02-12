import supabase from "../util/Supabase/supabase";

export async function getCountriesStats() {

    const { count: totalCountries, error: totalErr } = await supabase.from("countries").select("*", { count: "exact" });

    if (totalErr) throw totalErr;

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const { count: currentMonthCount, error: monthErr } = await supabase.from("countries").select("*", { count: "exact" }).gte("created_at", startOfMonth);

    if (monthErr) throw monthErr;

    const startOfPrevMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    const endOfPrevMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
    const { count: prevMonthCount, error: prevErr } = await supabase.from("countries").select("*", { count: "exact" }).gte("created_at", startOfPrevMonth.toISOString()).lte("created_at", endOfPrevMonth.toISOString());

    if (prevErr) throw prevErr;

    const change = prevMonthCount ? Math.round(((currentMonthCount - prevMonthCount) / prevMonthCount) * 100 * 10) / 10 : currentMonthCount ? 100 : 0;

    const isIncrease = currentMonthCount >= prevMonthCount;

    return {
        totalCountries,
        monthlyChange: change,
        isIncrease,
    };
}
