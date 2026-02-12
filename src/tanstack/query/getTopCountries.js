import { useQuery } from "@tanstack/react-query";
import { fetchAppliedCountryStatsByOriginId } from "../../functions/fetchTopCountries";

export const useTopCountries = (country_id) => {
  return useQuery({
    queryKey: ["top-countries", country_id],
    queryFn: () => fetchAppliedCountryStatsByOriginId(country_id)
  });
}