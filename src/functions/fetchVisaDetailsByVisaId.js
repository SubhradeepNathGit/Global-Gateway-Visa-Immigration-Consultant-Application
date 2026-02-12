import supabase from "../util/Supabase/supabase";

export const fetchVisaDetailsByVisaId = async (visaId) => {
    
    if (!visaId) return [];

    const { data, error } = await supabase.from("visa_details").select('*').eq("visa_id", visaId);

    if (error) throw error;

    return data || [];
};
