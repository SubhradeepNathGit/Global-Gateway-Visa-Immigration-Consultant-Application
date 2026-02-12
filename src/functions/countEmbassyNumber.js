import supabase from "../util/Supabase/supabase";

export const getAvailableEmbassyCount = async (countryId) => {
    // console.log('fetching embassy count for country id', countryId);

    if (!countryId) return 0;

    const { count, error } = await supabase.from('embassy').select('*', { count: 'exact', head: true }).eq('country_id', countryId).eq("is_approved", "fulfilled").eq('is_country_available', true);

    if (error) {
        console.error('Error fetching embassy count:', error);
        return 0;
    }

    return count || 0;
};