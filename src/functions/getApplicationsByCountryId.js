import supabase from "../util/Supabase/supabase";

export const getApplicationsByCountryId = async ({ countryId, applicationStatus }) => {
    if (!countryId) return [];

    let statuses = [];
    if (applicationStatus === "all") {
        statuses = ["processing", "approved", "rejected"];
    } else if (Array.isArray(applicationStatus)) {
        statuses = applicationStatus;
    } else {
        statuses = [applicationStatus];
    }

    const { data, error } = await supabase.from("applications").select("*").eq("country_id", countryId).in("status", statuses).order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching applications:", error.message);
        throw new Error(error.message);
    }

    return data ?? [];
};