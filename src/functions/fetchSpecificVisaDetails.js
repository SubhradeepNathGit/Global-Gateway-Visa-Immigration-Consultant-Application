import supabase from "../util/Supabase/supabase";

export const getVisaDetailsById = async ({ country_id, visa_id }) => {
    // console.log('Visa details id', country_id, visa_id);

    const { data, error } = await supabase.from("visa_details").select(`*`).eq("visa_id", visa_id).eq("country_id", country_id).single();

    // console.log('Visa Details response', data, error);

    if (error) throw error;
    return data;
};
