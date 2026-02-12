import { useQuery } from "@tanstack/react-query";
import { fetchCountryVisasByCountryId } from "../../functions/fetchCountryVisas";

export const useCountryVisas = (countryId) => {
  return useQuery({
    queryKey: ["country-visas", countryId],
    queryFn: () => fetchCountryVisasByCountryId(countryId),
    enabled: !!countryId,
  });
};
