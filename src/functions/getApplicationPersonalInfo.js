import supabase from "../util/Supabase/supabase";

export async function fetchPersonalInfoByApplicationId(application_id) {
    // console.log('Application id for fetching personal information', application_id);

    if (!application_id) return null;

    const res = await supabase.from("application_personal_info").select("*").eq("application_id", application_id).single();
    // console.log('Response for fetching personal information', res);

    if (res.error) throw new Error(res.error.message);
    return res.data;
}