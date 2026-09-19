import supabase from "../util/Supabase/supabase";
import { getFallbackReasonById } from "../data/appointmentReasonsData";

export const fetchAppointmentReasonByReasonId = async (reasonId) => {
    if (!reasonId) return null;

    try {
        const res = await supabase.from("appointment_reason").select("*").eq("reason_id", reasonId).maybeSingle();
        if (res?.data) return res.data;
    } catch (err) {
        console.warn('Error fetching reason for reasonId:', err);
    }

    return getFallbackReasonById(reasonId);
};