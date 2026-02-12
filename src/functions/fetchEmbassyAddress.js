import supabase from "../util/Supabase/supabase";

export const fetchEmbassiesAddress = async (countryId) => {
    // console.log('fetching embassy address for countryId', countryId);

    try {
        const res = await supabase.from('embassy').select('*').eq('is_blocked', false).eq('country_id', countryId);
        // console.log('Response for fetching embassy address for country', res);

        if (res?.error) throw res?.error;

        return res?.data || [];
    } catch (err) {
        console.error('Error fetching embassies:', err);
        throw err;
    }
}