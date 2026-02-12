import supabase from "../util/Supabase/supabase";

export const fetchVisaSummary = async (visaId) => {
    if (!visaId) return null;

    /* Fetch visa_details (country-wise status) */
    const { data: visaDetails, error: visaError } = await supabase.from("visa_details").select("country_id, status").eq("visa_id", visaId);

    if (visaError) throw visaError;

    const activeCountries = visaDetails.filter(v => v.status === "active").length;
    const blockedCountries = visaDetails.filter(v => v.status !== "active").length;

    /* Fetch application IDs for this visa */
    const { data: visaApplications, error: appVisaError } = await supabase.from("application_visa_details").select("application_id").eq("visaId", visaId);

    if (appVisaError) throw appVisaError;

    if (!visaApplications.length) {
        return {
            activeCountries,
            blockedCountries,
            totalApplications: 0,
        };
    }

    const applicationIds = visaApplications.map(v => v.application_id);

    /* Count applications with valid statuses */
    const { count, error: appError } = await supabase.from("applications").select("id", { count: "exact", head: true }).in("id", applicationIds).in("status", ["processing", "approved", "rejected"]);

    if (appError) throw appError;

    return {
        activeCountries,
        blockedCountries,
        totalApplications: count ?? 0,
    };
}