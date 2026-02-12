export const buildMonthlyApplicationVolume = (applications = []) => {
    const monthMap = {};

    applications.forEach(app => {
        const date = new Date(app.created_at);
        const monthKey = date.toLocaleString("default", { month: "short" });

        monthMap[monthKey] = (monthMap[monthKey] || 0) + 1;
    });

    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return monthOrder.map(month => ({
        month,
        value: monthMap[month] || 0,
    }));
};