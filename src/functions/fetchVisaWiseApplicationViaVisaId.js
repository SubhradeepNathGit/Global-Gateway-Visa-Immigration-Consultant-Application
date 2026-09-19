import supabase from "../util/Supabase/supabase";

export const fetchVisaWiseApplicationViaVisaId = async ({ visaId, applicationStatus }) => {
    if (!visaId) return [];

    try {
        let statuses = [];
        if (applicationStatus === "all" || !applicationStatus) {
            statuses = ["processing", "approved", "rejected"];
        } else if (Array.isArray(applicationStatus)) {
            statuses = applicationStatus;
        } else {
            statuses = [applicationStatus];
        }

        // Get visa_type from visa table
        const { data: visaRecord } = await supabase
            .from("visa")
            .select("visa_type")
            .eq("id", visaId)
            .maybeSingle();

        const visaType = visaRecord?.visa_type;

        let query = supabase.from("application_visa_details").select("application_id");
        if (visaType) {
            query = query.eq("visa_type", visaType);
        } else {
            query = query.eq("visaid", visaId);
        }

        const { data: visaData, error: visaError } = await query;
        if (visaError) throw visaError;

        const applicationIds = (visaData || []).map(v => v.application_id).filter(Boolean);
        if (applicationIds.length === 0) return [];

        // Fetch applications in ONE query
        const { data: applications, error: appError } = await supabase
            .from("applications")
            .select("*")
            .in("id", applicationIds)
            .in("status", statuses);

        if (appError) throw appError;

        return applications || [];
    } catch (err) {
        console.error("Error in fetchVisaWiseApplicationViaVisaId:", err);
        return [];
    }
};
