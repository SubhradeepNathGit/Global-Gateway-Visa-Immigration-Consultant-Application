import supabase from "../util/Supabase/supabase";

export async function getApplicationDocuments(application_id) {
    if (!application_id) return null;

    const res = await supabase.from("application_documents").select("*").eq("application_id", application_id).maybeSingle();
    // console.log('Response for fetching documents', res);

    if (res.error) throw res.error;
    return res.data;
}