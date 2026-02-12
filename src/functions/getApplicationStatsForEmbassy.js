import supabase from "../util/Supabase/supabase";

export const getApplicationStatsByMonth = async ({ countryId, statusFilter = "all" }) => {
    if (!countryId) return [];

    let statuses = [];

    if (statusFilter === "all") {
        statuses = ["processing", "approved", "rejected"];
    } else {
        statuses = [statusFilter];
    }

    const { data, error } = await supabase.from("applications").select("created_at, status").eq("country_id", countryId).in("status", statuses);

    if (error) {
        console.error(error.message);
        throw new Error(error.message);
    }

    const monthlyMap = {};

    data.forEach((item) => {
        const date = new Date(item.created_at);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

        if (!monthlyMap[key]) {
            monthlyMap[key] = 0;
        }
        monthlyMap[key]++;
    });

    const sortedMonths = Object.keys(monthlyMap).sort((a, b) => new Date(a) - new Date(b)).map((month) => ({
        month,
        total: monthlyMap[month],
    }));

    const result = sortedMonths.map((item, index) => {
        if (index === 0) {
            return { ...item, changeRate: 0 };
        }

        const prev = sortedMonths[index - 1].total;
        const curr = item.total;

        const rate =
            prev === 0 ? 100 : (((curr - prev) / prev) * 100).toFixed(2);

        return {
            ...item,
            changeRate: Number(rate),
        };
    });

    return result;
}