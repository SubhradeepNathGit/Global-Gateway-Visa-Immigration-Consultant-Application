import supabase from "../util/Supabase/supabase";

export const fetchApplicationBasedonCountryIdAndVisaId = async ({ countryId, visaId }) => {
    const { data, error } = await supabase
        .from("applications")
        .select(
            `
        id,
        status,
        application_visa_details!inner (
          visaId
        )
      `
        )
        .eq("country_id", countryId)
        .eq("application_visa_details.visaId", visaId);

    if (error) throw error;

    return data;
};
