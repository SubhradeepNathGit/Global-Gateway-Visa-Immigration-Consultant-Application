import supabase from "../util/Supabase/supabase";

export const fetchAllVisaPoliciesForCountry = async () => {
    try {
        const { data, error } = await supabase.from('visa_details').select('*');

        if (error) throw error;
        return data;
    }
    catch (err) {
        console.error('Error fetching visa policies:', err.message);
        return [];
    }
}