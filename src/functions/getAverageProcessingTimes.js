import supabase from "../util/Supabase/supabase";

export async function getAverageProcessingTimes() {
    const { data: visaTypes, error: visaErr } = await supabase.from("visa").select("id, visa_type").eq("status", "active");

    if (visaErr) throw visaErr;
    if (!visaTypes?.length) return [];

    const visaIds = visaTypes.map(v => v.id);

    const { data: visaDetails, error: detailsErr } = await supabase.from("visa_details").select("visa_id, visa_processing_time").in("visa_id", visaIds).eq("status", "active");

    if (detailsErr) throw detailsErr;

    const parseDays = (str) => {
        if (!str) return 0;

        const cleaned = str.replace("days", "").trim();
        if (cleaned.includes("-") || cleaned.includes("–")) {
            const [min, max] = cleaned.split(/-|–/).map(v => parseInt(v.trim()));
            return (min + max) / 2;
        }

        return parseInt(cleaned);
    };

    // Build results
    const result = visaTypes.map((visa) => {
        const details = visaDetails.filter(d => d.visa_id === visa.id);

        const daysArr = details.map(d => parseDays(d.visa_processing_time));

        const avgDays =daysArr.length? Math.round(daysArr.reduce((a, b) => a + b, 0) / daysArr.length): 0;

        return {
            visa_type: visa.visa_type,
            avg_days: avgDays,
        };
    });

    return result;
}