import supabase from "../util/Supabase/supabase";

export const fetchVisaWiseApplicationViaVisaId = async ({ visaId, applicationStatus }) => {
    
    if (!visaId) return [];

    let statuses = [];
    if (applicationStatus === "all") {
        statuses = ["processing", "approved", "rejected"];
    } else if (Array.isArray(applicationStatus)) {
        statuses = applicationStatus;
    } else {
        statuses = [applicationStatus];
    }

    // Get application IDs for visa
    const { data: visaData, error: visaError } = await supabase.from("application_visa_details").select("application_id").eq("visaId", visaId);

    if (visaError) throw visaError;

    const applicationIds = visaData.map(v => v.application_id);

    if (applicationIds.length === 0) return [];

    // Fetch applications in ONE query
    const { data: applications, error: appError } = await supabase.from("applications").select("*").in("id", applicationIds).in("status", statuses);

    if (appError) throw appError;

    return applications;
};
