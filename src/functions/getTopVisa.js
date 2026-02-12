import supabase from "../util/Supabase/supabase";

export async function getTopVisa() {

    const { data, error } = await supabase.from("application_visa_details").select(`visa_type,applications (status)`);

    if (error) throw error;

    if (!data || !data.length) return null;

    // Calculate count per visa type
    const visaCounts = {};
    const visaApproved = {};

    data.forEach((item) => {
        const visa = item.visa_type;
        visaCounts[visa] = (visaCounts[visa] || 0) + 1;

        // Count approved applications
        if (item.applications?.status === "approved") {
            visaApproved[visa] = (visaApproved[visa] || 0) + 1;
        }
    });

    // Find top visa by count
    const topVisa = Object.entries(visaCounts).reduce(
        (max, [visa, count]) => (count > max.count ? { visa, count } : max),
        { visa: null, count: 0 }
    );

    const approvedCount = visaApproved[topVisa.visa] || 0;
    const approvalRate = topVisa.count ? Math.round((approvedCount / topVisa.count) * 100) : 0;

    return {
        visa_type: topVisa.visa,
        count: topVisa.count,
        approvalRate,
    };
}