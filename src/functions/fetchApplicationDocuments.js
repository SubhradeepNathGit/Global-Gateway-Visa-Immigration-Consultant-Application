import supabase from "../util/Supabase/supabase";

export async function getApplicationDocuments(application_id) {
    // console.log('Application id for fetching documents', application_id);

    const res = await supabase.from("application_documents").select("*").eq("application_id", application_id).single();
    // console.log('Response for fetching documents', res);

    if (res.error) throw res.error;
    return res.data;
}