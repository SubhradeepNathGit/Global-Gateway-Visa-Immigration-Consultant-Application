import supabase from "../util/Supabase/supabase";

export async function getTopCountry() {

    const { data: apps } = await supabase.from("applications").select("id, country_id, status");

    const { data: countries } = await supabase.from("countries").select("id, name");
    // console.log(apps, countries);

    const countryMap = {};
    apps.forEach(app => {
        const country = countries.find(c => c.id === app.country_id)?.name || "Unknown";
        if (!countryMap[country]) countryMap[country] = { total: 0, approved: 0 };
        countryMap[country].total += 1;
        if (app.status === "approved") countryMap[country].approved += 1;
    });

    const topCountry = Object.entries(countryMap).sort((a, b) => b[1].total - a[1].total)[0];

    const [name, { total, approved }] = topCountry || [];
    const successRate = total ? Math.round((approved / total) * 100) : 0;

    return ({ name, total, successRate });
}
