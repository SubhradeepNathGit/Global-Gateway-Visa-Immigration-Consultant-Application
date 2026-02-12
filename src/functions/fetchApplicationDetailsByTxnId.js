import supabase from "../util/Supabase/supabase";

export async function fetchApplicationByTxnId(txn_id) {
    // console.log('Fetching application for specific transaction ID', txn_id);

    const res = await supabase.from("application_payment").select("*").eq("transaction_id", txn_id).order("created_at", { ascending: false }).limit(1).single();
    // console.log('Response for fetching application', res);

    if (res.error) {
        throw new Error(res.error.message);
    }

    return res.data;
}