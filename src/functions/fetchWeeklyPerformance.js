import supabase from "../util/Supabase/supabase";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const fetchWeeklyPerformance = async () => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const { data, error } = await supabase.from("applications").select(`created_at,status,application_payment (amount,status)
        `).gte("created_at", startOfWeek.toISOString()).lt("created_at", endOfWeek.toISOString());

    if (error) throw error;

    return normalizeWeeklyData(data);
};

const normalizeWeeklyData = (rows = []) => {
    const map = {};

    rows.forEach(app => {
        const day = new Date(app.created_at).toLocaleDateString("en-US", {
            weekday: "short",
        });

        if (!map[day]) {
            map[day] = { applications: 0, approvals: 0, revenue: 0 };
        }

        map[day].applications += 1;

        if (app.status === "approved") {
            map[day].approvals += 1;
        }

        const payment = app.application_payment?.[0];
        if (payment?.status === "success") {
            map[day].revenue += Number(payment.amount || 0);
        }
    });

    return DAYS.map(day => ({
        day,
        applications: map[day]?.applications || 0,
        approvals: map[day]?.approvals || 0,
        revenue: map[day]?.revenue || 0,
    }));
}