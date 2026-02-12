// functions/fetchVisaDetailsRaw.js
import supabase from "../util/Supabase/supabase";

export const fetchVisaDetailsRaw = async ({ visaId, countryId }) => {
  if (!visaId) return [];

  let query = supabase
    .from("visa_details")
    .select(`
      visa_processing_time,
      visa_validity,
      visa_fees
    `)
    .eq("visa_id", visaId);

  if (countryId) {
    query = query.eq("country_id", countryId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
};
