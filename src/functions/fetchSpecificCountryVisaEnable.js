import supabase from "../util/Supabase/supabase";

export const fetchSpecificCountryVisaEnable = async (country_id) => {
    // console.log('Specific visa enable country id', country_id);

    const { data, error } = await supabase.from("country_visas").select(`*`).eq("country_id", country_id);

    // console.log('Visa enable response for specific country', data, error);

    if (error) throw error;
    return data;
};
