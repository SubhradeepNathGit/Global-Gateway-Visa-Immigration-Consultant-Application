import supabase from "../util/Supabase/supabase";

export const fetchCountryWiseVisaDetails = async (countryId) => {
    if (!countryId) return [];

    // console.log("Fetching visa for country id:", countryId);

    // Fetch visa IDs from country_visas
    const visaIdRes = await supabase.from("country_visas").select("visa_id").eq("country_id", countryId).single();

    if (visaIdRes.error) throw new Error(visaIdRes.error.message);

    const visaIDs = visaIdRes.data?.visa_id || [];
    if (visaIDs.length === 0) return [];

    // Fetch visa list
    const visaListRes = await supabase.from("visa").select("*").in("id", visaIDs);

    if (visaListRes.error) throw new Error(visaListRes.error.message);

    const visas = visaListRes.data;

    // Fetch visa details for this country
    const visaDetailsRes = await supabase.from("visa_details").select("*").eq("country_id", countryId).in("visa_id", visaIDs);

    if (visaDetailsRes.error) throw new Error(visaDetailsRes.error.message);

    const visaDetails = visaDetailsRes.data;

    // Merge data
    const merged = visas.map((visa) => ({
        ...visa,
        visa_details: visaDetails.filter((d) => d.visa_id === visa.id),
    }));

    return merged;
};
