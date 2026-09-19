import supabase from "../util/Supabase/supabase";

export const fetchVisaSummary = async (visaId) => {
    if (!visaId) return { activeCountries: 0, blockedCountries: 0, totalApplications: 0 };

    try {
        /* Fetch visa_details (country-wise status) */
        const { data: visaDetails, error: visaError } = await supabase
            .from("visa_details")
            .select("country_id, status")
            .eq("visa_id", visaId);

        if (visaError) throw visaError;

        const activeCountries = (visaDetails || []).filter(v => v.status === "active").length;
        const blockedCountries = (visaDetails || []).filter(v => v.status !== "active").length;

        /* Get visa_type from visa table */
        const { data: visaRecord } = await supabase
            .from("visa")
            .select("visa_type")
            .eq("id", visaId)
            .maybeSingle();

        const visaType = visaRecord?.visa_type;

        /* Fetch application IDs for this visa by visa_type or visaid */
        let appVisaQuery = supabase.from("application_visa_details").select("application_id");
        if (visaType) {
            appVisaQuery = appVisaQuery.eq("visa_type", visaType);
        } else {
            appVisaQuery = appVisaQuery.eq("visaid", visaId);
        }

        const { data: visaApplications, error: appVisaError } = await appVisaQuery;
        if (appVisaError) throw appVisaError;

        if (!visaApplications || !visaApplications.length) {
            return {
                activeCountries,
                blockedCountries,
                totalApplications: 0,
            };
        }

        const applicationIds = visaApplications.map(v => v.application_id).filter(Boolean);
        if (applicationIds.length === 0) {
            return {
                activeCountries,
                blockedCountries,
                totalApplications: 0,
            };
        }

        /* Count applications with valid statuses */
        const { count, error: appError } = await supabase
            .from("applications")
            .select("id", { count: "exact", head: true })
            .in("id", applicationIds)
            .in("status", ["processing", "approved", "rejected"]);

        if (appError) throw appError;

        return {
            activeCountries,
            blockedCountries,
            totalApplications: count ?? 0,
        };
    } catch (err) {
        console.error("Error in fetchVisaSummary:", err);
        return {
            activeCountries: 0,
            blockedCountries: 0,
            totalApplications: 0,
        };
    }
};