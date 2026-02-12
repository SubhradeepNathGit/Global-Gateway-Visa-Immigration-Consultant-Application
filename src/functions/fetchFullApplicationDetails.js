import supabase from "../util/Supabase/supabase";

export const fetchFullApplicationDetails = async (applicationId) => {
    //   console.log('Received application id to fetch details', applicationId);

    const res = await supabase.from("applications").select(`*,
                application_personal_info (*),
                application_passport (*), 
                application_visa_details (*),
                application_documents (*),
                application_payment (*)
                `).eq("id", applicationId).single();

    //   console.log('Application response', res);

    if (res?.error) {
        throw new Error(res?.error.message);
    }

    return res?.data;
};