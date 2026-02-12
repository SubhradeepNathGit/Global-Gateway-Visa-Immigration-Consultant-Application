import supabase from "../util/Supabase/supabase";

export const fetchApplicationsWithAppointment = async (countryId, status, hasAppointment = false, past = false) => {
    if (!countryId) return [];

    let query = supabase.from("applications").select(`*,
    application_documents (*),
    application_passport (*),
    application_payment (*),
    application_personal_info (*),
    application_visa_details (*)
    `).eq("country_id", countryId);

    // Filter by status if provided
    if (status) {
        query = query.eq("status", status);
    }

    // Only applications with appointment
    if (hasAppointment) {
        query = query.not("appointment_date", "is", null);
    }

    // Only past appointments
    if (past) {
        query = query.lt("appointment_date", new Date().toISOString());
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return data || [];
};
