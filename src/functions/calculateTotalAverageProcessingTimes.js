import supabase from "../util/Supabase/supabase";

const parseDays = (str) => {
    if (!str) return 0;
    const cleaned = str.replace("days", "").trim();
    if (cleaned.includes("-") || cleaned.includes("–")) {
        const [min, max] = cleaned.split(/-|–/).map(v => parseInt(v.trim()));
        return (min + max) / 2;
    }
    return parseInt(cleaned);
};

export async function calculateTotalAverageProcessingTimes() {
    const { data: visaTypes, error: visaErr } = await supabase.from("visa").select("id, visa_type").eq("status", "active");

    if (visaErr) throw visaErr;
    if (!visaTypes?.length) return { visaAverages: [], totalAverage: 0, change: 0 };

    const visaIds = visaTypes.map(v => v.id);

    const { data: visaDetails, error: detailsErr } = await supabase.from("visa_details").select("visa_id, visa_processing_time, created_at").in("visa_id", visaIds).eq("status", "active");

    if (detailsErr) throw detailsErr;

    const currentYear = new Date().getFullYear();
    const prevYear = currentYear - 1;

    const currentYearData = visaDetails.filter(d => new Date(d.created_at).getFullYear() === currentYear);
    const prevYearData = visaDetails.filter(d => new Date(d.created_at).getFullYear() === prevYear);

    const calculateAverage = (arr) => {
        const averages = visaTypes.map(v => {
            const details = arr.filter(d => d.visa_id === v.id);
            const daysArr = details.map(d => parseDays(d.visa_processing_time));
            return daysArr.length ? Math.round(daysArr.reduce((a, b) => a + b, 0) / daysArr.length) : 0;
        });
        return averages.length ? Math.round(averages.reduce((a, b) => a + b, 0) / averages.length) : 0;
    };

    const totalCurrentYear = calculateAverage(currentYearData);
    const totalPrevYear = calculateAverage(prevYearData);

    const change = totalPrevYear
        ? (((totalCurrentYear - totalPrevYear) / totalPrevYear) * 100).toFixed(1)
        : 0;

    const visaAverages = visaTypes.map(v => {
        const details = currentYearData.filter(d => d.visa_id === v.id);
        const avgDays = details.length
            ? Math.round(details.map(d => parseDays(d.visa_processing_time)).reduce((a, b) => a + b, 0) / details.length)
            : 0;
        return { visa_type: v.visa_type, avg_days: avgDays };
    });

    return { visaAverages, totalAverage: totalCurrentYear, change: parseFloat(change) };
}