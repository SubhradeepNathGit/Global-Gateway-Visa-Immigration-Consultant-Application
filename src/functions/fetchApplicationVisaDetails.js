import supabase from "../util/Supabase/supabase";

export async function fetchVisaDetailsByApplicationId(applicationId) {
    // console.log('Application id for fetching visa data', applicationId);

    if (!applicationId) throw new Error("Application ID is required");

    const res = await supabase.from("application_visa_details").select("*").eq("application_id", applicationId).single();
    // console.log('Response for fetching visa information', res);

    if (res.error) throw new Error(res.error.message);

    return res.data;
}
