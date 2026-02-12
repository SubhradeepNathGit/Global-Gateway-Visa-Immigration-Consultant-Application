import supabase from "../util/Supabase/supabase";

export async function calculateCountryWiseRevenue(country_id) {
  let query = supabase
    .from("application_payment")
    .select(`
      amount,
      status,
      applications!inner(country_id)
    `)
    .eq("status", "success");

  if (country_id) {
    query = query.eq("applications.country_id", country_id);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Aggregate by country_id
  const result = data.reduce((acc, payment) => {
    const country_id = payment.applications.country_id;
    if (!acc[country_id]) {
      acc[country_id] = { total_transactions: 0, total_amount: 0 };
    }
    acc[country_id].total_transactions += 1;
    acc[country_id].total_amount += Number(payment.amount || 0);
    return acc;
  }, {});

  return Object.entries(result).map(([country_id, stats]) => ({
    country_id,
    ...stats
  }));
}
