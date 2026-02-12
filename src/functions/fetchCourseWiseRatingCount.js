import supabase from "../util/Supabase/supabase";

export const fetchCourseRatingCount = async (courseId) => {
    // console.log('Received data for fetching course wise rating count in function', courseId);

    const res = await supabase.from('course_ratings').select('*').eq('course_id', courseId);
    // console.log('Response for fetching course wise rating count', res);

    if (res?.error) throw res?.error;

    return res?.data?.length;
};
