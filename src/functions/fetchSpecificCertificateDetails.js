import supabase from "../util/Supabase/supabase";

export const getUserCertificates = async ({ userId, courseId }) => {
    // console.log('Received data for fetching specific certificate details in function', userId, courseId);

    if (!userId || !courseId) return [];

    const res = await supabase.from("certificates").select("*").eq("user_id", userId).eq("course_id", courseId).maybeSingle();
    // console.log('Response for fetching certificate details', res);

    if (res?.error) throw res?.error;
    return res?.data ?? [];
};