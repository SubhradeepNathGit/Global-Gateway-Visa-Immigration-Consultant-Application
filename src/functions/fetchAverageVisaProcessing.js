import supabase from "../util/Supabase/supabase";
import { processingTimeToDays } from "../util/avgVisaConverter/processing-time/processingTime";
import { daysToReadableTime } from "../util/avgVisaConverter/processing-time/formatProcessingTime";

export const fetchAverageProcessingTimeByVisa = async (visaId) => {
    if (!visaId) return "N/A";

    const res = await supabase.from("visa_details").select("visa_processing_time").eq("visa_id", visaId).eq("status", "active");
    // console.log('Response for fetching specific type visa processing time', res);

    if (res?.error) throw res?.error;
    if (!res?.data || res?.data.length === 0) return "N/A";

    const totalDays = res?.data.reduce((sum, row) => {
        return sum + processingTimeToDays(row.visa_processing_time);
    }, 0);

    const avgDays = totalDays / res?.data.length;

    return daysToReadableTime(avgDays);
}