// api/fetchRevenueTrends.js
import supabase from "../util/Supabase/supabase";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// simple target logic (customize as needed)
function getTarget(monthIndex) {
    if (monthIndex < 3) return 50000;
    if (monthIndex < 6) return 60000;
    if (monthIndex < 9) return 70000;
    return 80000;
}

export async function fetchRevenueTrends(year = new Date().getFullYear()) {

    //  Fetch applications
    const { data: applications, error: appError } = await supabase.from("applications").select("id, created_at").gte("created_at", `${year}-01-01`).lte("created_at", `${year}-12-31`);

    if (appError) throw appError;

    // Fetch successful payments
    const { data: payments, error: payError } = await supabase.from("application_payment").select("application_id, amount, created_at").eq("status", "success").gte("created_at", `${year}-01-01`).lte("created_at", `${year}-12-31`);

    if (payError) throw payError;

    //  Initialize monthly map
    const monthlyData = {};
    MONTHS.forEach((m, idx) => {
        monthlyData[idx] = {
            month: m,
            revenue: 0,
            applications: 0,
            target: getTarget(idx),
        };
    });

    // Count applications per month
    applications.forEach(app => {
        const monthIndex = new Date(app.created_at).getMonth();
        monthlyData[monthIndex].applications += 1;
    });

    // Sum revenue per month
    payments.forEach(pay => {
        const monthIndex = new Date(pay.created_at).getMonth();
        monthlyData[monthIndex].revenue += Number(pay.amount || 0);
    });

    return Object.values(monthlyData);
}