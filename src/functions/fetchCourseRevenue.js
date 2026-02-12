import supabase from "../util/Supabase/supabase";

export const fetchCourseRevenue = async ({ status = "success" }) => {
    const { data, error } = await supabase.from("orders").select(`id,status,order_items (price,courses (id,course_name))`).eq("status", status);

    if (error) throw error;

    if (!data?.length) return [];

    const revenueMap = new Map();

    data.forEach(order => {
        order.order_items?.forEach(item => {
            const course = item.courses;
            if (!course) return;

            const prev = revenueMap.get(course.id) || {
                courseId: course.id,
                name: course.course_name,
                value: 0,
            };

            prev.value += Number(item.price);

            revenueMap.set(course.id, prev);
        });
    });

    return Array.from(revenueMap.values());
};
