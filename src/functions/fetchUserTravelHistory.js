import supabase from "../util/Supabase/supabase";

export const getFulfilledApplicationsByUser = async (userId, status) => {
    // Fetch applications
    const { data: applications, error: appError } = await supabase.from("applications").select("*").eq("status", status).eq("user_id", userId);

    if (appError) throw appError;
    if (!applications || applications.length === 0) return [];

    // Extract unique country IDs
    const countryIds = [
        ...new Set(applications.map((app) => app.country_id)),
    ];
    
    // Extract unique applications IDs
    const applicationIds = [
        ...new Set(applications.map((app) => app.id)),
    ];

    // Fetch related countries
    const { data: countries, error: countryError } = await supabase.from("countries").select("*").in("id", countryIds);

    if (countryError) throw countryError;

    // Create country lookup map
    const countryMap = countries.reduce((acc, country) => {
        acc[country.id] = country;
        return acc;
    }, {});
   
    // Fetch related visa details
    const { data: visas, error: visaError } = await supabase.from("application_visa_details").select("*").in("application_id", applicationIds);

    if (visaError) throw visaError;

    // Create country lookup map
    const visaMap = visas.reduce((acc, visa) => {
        acc[visa.application_id] = visa;
        return acc;
    }, {});

    // Merge applications with country details
    const result = applications.map((app) => ({
        ...app,
        country: countryMap[app.country_id] || null,
        visa: visaMap[app.id] || null,
    }));

    return result;
};
