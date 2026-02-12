import supabase from "../util/Supabase/supabase";

export async function fetchTotalRevenue() {
    //  Fetch all successful transactions
    const { data, error } = await supabase.from('transaction_details').select('amount').eq('status', 'success');

    if (error) throw error;

    if (!data || data.length === 0) return 0;

    // Sum all amounts (convert text → number)
    const totalRevenue = data.reduce((sum, txn) => {
        return sum + Number(txn.amount || 0);
    }, 0);

    return totalRevenue;
}