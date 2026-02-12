import supabase from "../util/Supabase/supabase";

export async function fetchVisaTypeStats() {
    const res = await supabase.from("application_visa_details").select("visa_type");
    // console.log('Response for fetching application visa details', res);

    if (res?.error) throw new Error(res?.error.message);

    // Grouping visa_type counts
    const grouped = res?.data.reduce((acc, item) => {
        acc[item.visa_type] = (acc[item.visa_type] || 0) + 1;
        return acc;
    }, {});

    return grouped;
}
