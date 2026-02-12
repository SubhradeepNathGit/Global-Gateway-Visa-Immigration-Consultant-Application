import supabase from "../util/Supabase/supabase";

export const fetchVisaDetailsByCountryAndVisitor = async ({ destinationCountryId, visitorCountryName }) => {
  // console.log('Destination country id', destinationCountryId, ' visitor country name', visitorCountryName);

  if (!destinationCountryId || !visitorCountryName) return [];

  //  get destination country id by name
  const { data: country, error: countryError } = await supabase.from("countries").select("id").ilike("name", visitorCountryName).maybeSingle();
  // console.log('Visitor country id', country);

  if (countryError || !country) return [];

  // fetch visa details
  const { data: visaDetails, error } = await supabase.from("visa_details").select("*").eq("visitor_country_id", country?.id).eq("country_id", destinationCountryId);
  // console.log('Visa details', visaDetails);

  if (error || !visaDetails?.length) return [];


  const visaIds = [...new Set(visaDetails.map(v => v.visa_id))];
  const { data: visas } = await supabase.from("visa").select("id, visa_type").in("id", visaIds);


  const visaMap = Object.fromEntries(visas.map(v => [v.id, v]));

  const merged = visaDetails.map(v => ({ ...v, visa: visaMap[v.visa_id] || null }));

  return merged ?? [];
};