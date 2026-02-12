import supabase from "../util/Supabase/supabase";

export const fetchEmbassyByCountryIdApi = async (countryId) => {
    // console.log('Fetching embassy based on country id', countryId);

    if (!countryId) return null;

    const res = await supabase.from("embassy").select("*").eq("country_id", countryId);
    // console.log('Response for fetching embassy based on country id', res);

    if (res?.error) {
        throw new Error(res?.error.message);
    }

    return res?.data ?? null;
}