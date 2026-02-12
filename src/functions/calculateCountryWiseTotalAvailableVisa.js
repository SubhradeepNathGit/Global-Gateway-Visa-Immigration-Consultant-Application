import supabase from "../util/Supabase/supabase";

export const calculateCountryWiseTotalAvailableVisa = async (countryId) => {
    if (!countryId) return 0;

    const { data, error } = await supabase.from("visa_details").select("visa_id").eq("country_id", countryId).eq("status", "active");

    if (error) throw error;

    const uniqueVisaIds = new Set(data.map(v => v.visa_id));

    return uniqueVisaIds.size;
}