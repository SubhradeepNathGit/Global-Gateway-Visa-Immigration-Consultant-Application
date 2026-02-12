import supabase from "../util/Supabase/supabase";

export const fetchUserCourseOrders = async ({ userId, status }) => {
    // console.log('Received data for fetching specific user course', userId, status);

    if (!userId) return [];

    let query = supabase.from("orders").select(`*, order_items (*, courses (*))`).eq("user_id", userId).order("created_at", { ascending: false });

    if (status) {
        query = query.eq("status", status);
    }

    const res = await query;
    // console.log('Response for fetching specific user orders', res);

    if (res?.error) throw res?.error;

    return res?.data;
};
