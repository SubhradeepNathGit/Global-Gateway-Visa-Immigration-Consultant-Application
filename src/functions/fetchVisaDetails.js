import supabase from "../util/Supabase/supabase"

export const fetchVisaDetails = async ({ countryId, visitorCountryId, visaId }) => {
    // console.log('Received data for fetching visa details', countryId, visitorCountryId, visaId);

    if (!countryId || !visitorCountryId || !visaId) {
        return []
    }

    const res = await supabase.from('visa_details').select('*').eq('country_id', countryId).eq('visa_id', visaId).eq('visitor_country_id', visitorCountryId)
    // console.log('Response for fetching visa details', res);

    if (res?.error) {
        throw new Error(res?.reserror.message)
    }

    return res?.data
}