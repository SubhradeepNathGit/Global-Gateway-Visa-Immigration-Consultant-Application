import supabase from "../util/Supabase/supabase";

export const fetchCountryVisaForSpecificCountry = async ({ countryId }) => {
    // console.log('Fetching granted visa country id', countryId);

    if (!countryId ) return null;

    const res = await supabase.from("country_visas").select("*").eq("country_id", countryId);
    // console.log('Response for fetching visa data', res);

    if (res?.error) {
        throw new Error(res?.error.message);
    }

    return res?.data;
};
