import supabase from "../util/Supabase/supabase";

export async function getFullCountryDetails(id) {
    // fetch country by id
    const { data: country, error: countryError } = await supabase.from("countries").select("*").eq("id", id).single();
    // console.log('Country details', country);

    if (countryError) throw countryError;

    // fetch details using country name
    const { data: details, error: detailsError } = await supabase.from("country_details").select("*").eq("country_id", id).single();
    // console.log('Country details', country, details);

    if (detailsError) throw detailsError;

    return {
        ...country,
        details,
    }
}

export async function getCountryMainDetails(id) {
    // fetch country by id
    const { data: country, error: countryError } = await supabase.from("countries").select("*").eq("id", id).single();
    // console.log('Country details', country);

    if (countryError) throw countryError;

    return country;
}