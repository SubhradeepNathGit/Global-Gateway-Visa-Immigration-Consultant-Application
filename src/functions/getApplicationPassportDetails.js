import supabase from "../util/Supabase/supabase";

export async function fetchPassportByApplicationId(application_id) {
    // console.log('Application id for fetching passport data', application_id);

    if (!application_id) return null;
    
    const res = await supabase.from("application_passport").select("*").eq("application_id", application_id).single();
    // console.log('Fetching passport data', res);

    if (res.error) throw new Error(res.error.message);
    return res.data;
}