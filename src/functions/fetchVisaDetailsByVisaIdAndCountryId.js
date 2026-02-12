import supabase from "../util/Supabase/supabase";

export const fetchVisaDetailsByVisaIdAndCountryId = async (visaId, countryId) => {
    if (!visaId) return [];

    const { data, error } = await supabase.from("visa_details").select('*').eq("visa_id", visaId).eq("country_id",countryId);

    if (error) throw error;

    return data || [];
};
