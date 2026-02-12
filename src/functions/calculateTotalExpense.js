import supabase from "../util/Supabase/supabase";

export async function fetchTotalExpenseByUser(userId) {
  if (!userId) return 0;

  // Fetch all application IDs for this user
  const { data: applications, error: appError } = await supabase.from('applications').select('id').eq('user_id', userId);

  if (appError) throw appError;
  if (!applications || applications.length === 0) return 0;

  const applicationIds = applications.map(app => app.id);

  // Fetch payments for those applications with status = 'success'
  const { data: payments, error: paymentError } = await supabase.from('application_payment').select('amount').in('application_id', applicationIds).eq('status', 'success');

  if (paymentError) throw paymentError;

  // Sum all amounts
  const total = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return total;
}
