import supabase from "../util/Supabase/supabase";
import { processingTimeToDays } from "../util/avgVisaConverter/processing-time/processingTime";
import { daysToReadableTime } from "../util/avgVisaConverter/processing-time/formatProcessingTime";

export const fetchCountryVisasByCountryId = async (countryId) => {
    if (!countryId) return { visas: [], avgProcessingTime: "N/A", avgProcessingDays: 0, visaTypes: [] };

    //  Fetch all active visa types
    const { data: visaTypes, error: visaTypesError } = await supabase.from("visa").select("id, visa_type").eq("status", "active");

    if (visaTypesError) throw visaTypesError;
    if (!visaTypes?.length) return { visas: [], avgProcessingTime: "N/A", avgProcessingDays: 0, visaTypes: [] };

    const visaTypeMap = {};
    visaTypes.forEach(v => visaTypeMap[v.id] = v.visa_type);

    // Fetch all visa_details for the country
    const { data: visaDetails, error: detailsError } = await supabase.from("visa_details").select("*").eq("country_id", countryId).eq("status", "active");

    if (detailsError) throw detailsError;

    //  Map visa_details with type and days
    const visasWithDays = visaDetails.map(detail => ({
        id: detail.visa_id,
        type: visaTypeMap[detail.visa_id] || "Unknown",
        days: processingTimeToDays(detail.visa_processing_time),
    }));

    // Calculate average days
    const totalDays = visasWithDays.reduce((sum, v) => sum + v.days, 0);
    const avgDays = visasWithDays.length ? totalDays / visasWithDays.length : 0;

    return {
        visas: visasWithDays,
        avgProcessingDays: Math.round(avgDays),
        avgProcessingTime: daysToReadableTime(avgDays),
        visaTypes: visaTypes.map(v => v.visa_type), 
    };
};
