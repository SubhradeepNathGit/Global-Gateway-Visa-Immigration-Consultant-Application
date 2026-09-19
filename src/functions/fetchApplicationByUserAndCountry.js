import supabase from "../util/Supabase/supabase";

export async function fetchApplicationByUserAndCountry(user_id, country_id) {
    // console.log('Fetching active application for specific country and specific user', country_id, user_id);

    if (!user_id || !country_id) return null;

    const res = await supabase.from("applications").select("*").eq("user_id", user_id).eq("country_id", country_id).order("created_at", { ascending: false }).limit(1).maybeSingle();
    // console.log('Response for fetching pending application', res);

    if (res.error) {
        throw new Error(res.error.message);
    }

    return res.data;
}