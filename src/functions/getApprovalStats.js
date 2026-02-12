import supabase from "../util/Supabase/supabase";

export async function fetchApprovalStats() {
    const now = new Date();

    // CURRENT MONTH RANGE
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

    // PREVIOUS MONTH RANGE
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

    // CURRENT MONTH DATA
    const { data: current, error: currErr } = await supabase.from("applications").select("status, created_at").gte("created_at", currentMonthStart).lte("created_at", currentMonthEnd);

    if (currErr) throw currErr;

    // PREVIOUS MONTH DATA
    const { data: previous, error: prevErr } = await supabase.from("applications").select("status, created_at").gte("created_at", prevMonthStart).lte("created_at", prevMonthEnd);

    if (prevErr) throw prevErr;

    // ---- Helper to calculate approval rate ----
    function calcRate(rows) {
        const approved = rows.filter(r => r.status === "approved").length;
        const rejected = rows.filter(r => r.status === "rejected").length;
        const total = approved + rejected;
        if (total === 0) return 0;
        return Number(((approved / total) * 100).toFixed(2));
    }

    const currentRate = calcRate(current);
    const previousRate = calcRate(previous);
    const delta = Number((currentRate - previousRate).toFixed(2));

    return {
        approvalRate: currentRate,
        previousRate: previousRate,
        delta: delta
    };
}