import supabase from "../util/Supabase/supabase";

export const fetchCourseAvgRating = async (courseId) => {
    // console.log('Received data for fetching course wise rating in function', courseId);

    const res = await supabase.from('course_ratings')
        .select('rating', { count: 'exact', aggregate: { avg: 'rating' } }).eq('course_id', courseId);
    // console.log('Response for fetching course wise rating', res);

    if (res?.error) throw res?.error;

    const avg = res?.data && res?.data.length ? res?.data.reduce((acc, item) => acc + item.rating, 0) / res?.data.length : 0;

    return avg;
};
