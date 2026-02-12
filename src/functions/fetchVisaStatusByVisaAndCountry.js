// functions/fetchVisaStatusData.js
import supabase from "../util/Supabase/supabase";

export const fetchVisaStatusData = async (visaId, countryId) => {
    if (!visaId || !countryId) return [];

    //  Fetch visa_details
    const { data: visaRows, error: visaError } = await supabase.from("visa_details").select("id, status, visitor_country_id").eq("visa_id", visaId).eq("country_id", countryId);

    if (visaError) throw visaError;

    if (!visaRows.length) return [];

    // Extract visitor country IDs
    const visitorCountryIds = [
        ...new Set(
            visaRows.map(v => v.visitor_country_id).filter(Boolean)
        ),
    ];

    // Fetch countries
    const { data: countries, error: countryError } = await supabase.from("countries").select("id, name").in("id", visitorCountryIds);

    if (countryError) throw countryError;

    //  Merge data
    const countryMap = Object.fromEntries(
        countries.map(c => [c.id, c.name])
    );

    return visaRows.map(v => ({
        ...v,
        visitor_country_name: countryMap[v.visitor_country_id] || "Unknown",
    }));
};
