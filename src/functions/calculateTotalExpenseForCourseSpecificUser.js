import supabase from "../util/Supabase/supabase";

export const fetchUserTotalExpense = async ({ userId, status = "success" }) => {
    if (!userId) return 0;

    const res = await supabase.from("orders").select("amount").eq("user_id", userId).eq("status", status);
    // console.log('Response for calculating total course expense of a specific user', res);

    if (res?.error) throw res?.error;

    const total = res?.data.reduce((sum, row) => sum + Number(row.amount), 0);

    return total;
};