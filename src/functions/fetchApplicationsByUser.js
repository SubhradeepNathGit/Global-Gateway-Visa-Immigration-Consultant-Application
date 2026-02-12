import supabase from "../util/Supabase/supabase";

export async function fetchApplicationsByUser(userId) {
    // console.log('User id for fetching applications', userId);

    if (!userId) return [];

    const res = await supabase.from('applications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    // console.log('Response for fetching application details for specific user', res);

    if (res?.error) throw res?.error;
    return res?.data;
}