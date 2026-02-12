import supabase from "../util/Supabase/supabase";

export const getRevenueTrend = async () => {
    const { data, error } = await supabase
        .from("transaction_details")
        .select("created_at, txn_for, amount")
        .eq("status", "success")
        .in("txn_for", ["visa", "course"]);

    if (error) throw error;

    return data || [];
};
