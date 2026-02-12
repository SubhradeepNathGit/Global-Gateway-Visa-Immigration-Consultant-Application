import supabase from "../util/Supabase/supabase";

export const fetchUsersByCourse = async ({ courseId, status }) => {
    let query = supabase.from("order_items").select(`id,price,created_at,orders(*)`).eq("course_id", courseId);

    if (status) {
        query = query.eq("orders.status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    const uniqueBuyer = [];
    data?.forEach(order => {
        if (order?.orders && !uniqueBuyer?.includes(order?.orders?.user_id)) {
            uniqueBuyer?.push(order?.orders?.user_id);
        }
    })
    return uniqueBuyer;
};
