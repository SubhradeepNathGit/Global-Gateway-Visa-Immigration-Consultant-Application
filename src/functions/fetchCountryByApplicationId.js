import supabase from "../util/Supabase/supabase";

export async function fetchCountryByApplicationId(applicationId) {
    //   console.log('Fetching country details for application ID', applicationId);

    const { data: app, error: appErr } = await supabase.from("applications").select("country_id").eq("id", applicationId).single();

    if (appErr) throw appErr;
    if (!app?.country_id) return null;

    // Fetch country using the country_id
    const { data: country, error: countryErr } = await supabase.from("countries").select("*").eq("id", app.country_id).single();

    if (countryErr) throw countryErr;

    return country;
}
