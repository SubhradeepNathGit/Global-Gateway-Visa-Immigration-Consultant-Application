import supabase from "../util/Supabase/supabase";

export const fetchCourseEnrollments = async ({ status = "success" }) => {
    const { data, error } = await supabase.from("orders").select(`id,status,order_items (course_id,courses (id,course_name))`).eq("status", status);

    if (error) throw error;
    if (!data?.length) return [];

    const enrollmentMap = new Map();

    data.forEach(order => {
        order.order_items?.forEach(item => {
            const course = item.courses;
            if (!course) return;

            const prev = enrollmentMap.get(course.id) || {
                courseId: course.id,
                name: course.course_name,
                value: 0,
            };

            prev.value += 1;
            enrollmentMap.set(course.id, prev);
        });
    });

    return Array.from(enrollmentMap.values());
};
