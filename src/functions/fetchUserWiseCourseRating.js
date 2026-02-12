import supabase from "../util/Supabase/supabase";

export const fetchUserWiseCourseRating = async (courseId, userId) => {
    // console.log('Received data for fetching user wise course rating in function', courseId);

    const res = await supabase.from('course_ratings').select('rating').eq('user_id', userId).eq('course_id', courseId).maybeSingle();;
    // console.log('Response for fetching user wise course rating', res);

    if (res?.error) throw res?.error;

    return res?.data;
};
