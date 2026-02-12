import supabase from "../util/Supabase/supabase";

export async function getApplicationsChartData() {
    const res = await supabase.from("applications").select("created_at");
    // console.log('Response for application chart', res);

    if (res.error) throw res.error;

    const months = Array(12).fill(0);

    res.data.forEach((item) => {
        const date = new Date(item.created_at);
        const monthIndex = date.getMonth();
        months[monthIndex] += 1;
    });

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return monthNames.map((m, i) => ({
        month_short: m,
        count: months[i],
    }));
}
