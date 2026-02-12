import { useQuery } from "@tanstack/react-query";
import { fetchCountryByApplicationId } from "../../functions/fetchCountryByApplicationId";

export function useCountryByApplicationId(applicationId) {
    // console.log('Fetching country details for application ID in query', applicationId);

  return useQuery({
    queryKey: ["country-by-application", applicationId],
    queryFn: () => fetchCountryByApplicationId(applicationId),
    enabled: !!applicationId,
  });
}
