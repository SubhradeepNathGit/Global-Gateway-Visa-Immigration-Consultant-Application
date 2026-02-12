import supabase from "../util/Supabase/supabase";

export async function fetchApplicationPayments(applicationId) {
    // console.log('Application id for fetching application payment', applicationId);

    if (!applicationId) return [];

    const res = await supabase.from('application_payment').select('*').eq('application_id', applicationId).order('created_at', { ascending: false });
    // console.log('Response for fetching application payment', res);

    if (res?.error) throw res?.error;
    return res?.data;
}