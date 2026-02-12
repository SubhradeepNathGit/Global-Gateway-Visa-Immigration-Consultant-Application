import supabase from "../util/Supabase/supabase";

export async function fetchVisaDetailsViaId(visaId) {
    // console.log('Fetching details for visa Id',visaId);
    
    const res = await supabase.from("visa").select("*").eq("id", visaId).maybeSingle();
    // console.log('Response for fetching visa details', res);

    if (res?.error) throw new Error(res?.error.message);

    return res?.data;
}
