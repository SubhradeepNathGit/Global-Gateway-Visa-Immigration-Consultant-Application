import supabase from "../util/Supabase/supabase";

export const fetchAppointmentReasonByReasonId = async (reasonId) => {
    if (!reasonId) return null;

    const res = await supabase.from("appointment_reason").select("*").eq("reason_id", reasonId).eq("status", true).single();
    // console.log('Response for fetching specific reason', res);

    if (res?.error) throw res?.error;

    return res?.data;
}