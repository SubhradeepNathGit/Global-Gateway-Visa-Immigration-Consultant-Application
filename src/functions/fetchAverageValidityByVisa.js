import supabase from "../util/Supabase/supabase";
import { validityToDays } from "../util/avgVisaConverter/validity-time/validityToDays";
import { daysToReadableValidity } from "../util/avgVisaConverter/validity-time/formatValidity";

export const fetchAverageValidityByVisa = async (visaId) => {
    if (!visaId) return "N/A";

    const res = await supabase.from("visa_details").select("visa_validity").eq("visa_id", visaId).eq("status", "active");

    if (res.error) throw res.error;
    if (!res.data || res.data.length === 0) return "N/A";

    const totalDays = res.data.reduce((sum, row) => {
        return sum + validityToDays(row.visa_validity);
    }, 0);

    const avgDays = totalDays / res.data.length;

    return daysToReadableValidity(avgDays);
};
