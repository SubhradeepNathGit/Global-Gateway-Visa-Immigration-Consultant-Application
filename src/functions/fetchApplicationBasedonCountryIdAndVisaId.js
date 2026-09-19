import supabase from "../util/Supabase/supabase";

export const fetchApplicationBasedonCountryIdAndVisaId = async ({ countryId, visaId }) => {
    if (!countryId || !visaId) return [];

    try {
        // Get visa_type from visa table
        const { data: visaRecord } = await supabase
            .from("visa")
            .select("visa_type")
            .eq("id", visaId)
            .maybeSingle();

        const visaType = visaRecord?.visa_type;

        // Query applications for this country that have this visa_type in application_visa_details
        let query = supabase
            .from("applications")
            .select(
                `
                id,
                status,
                application_visa_details!inner (
                    visa_type
                )
                `
            )
            .eq("country_id", countryId);

        if (visaType) {
            query = query.eq("application_visa_details.visa_type", visaType);
        }

        const { data, error } = await query;
        if (error) throw error;

        return data || [];
    } catch (err) {
        console.error("Error in fetchApplicationBasedonCountryIdAndVisaId:", err);
        return [];
    }
};
