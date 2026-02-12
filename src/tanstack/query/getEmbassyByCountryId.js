import { useQuery } from "@tanstack/react-query";
import { fetchEmbassyByCountryIdApi } from "../../functions/fetchEmbassyByCountryId";

export const useEmbassyByCountryId = (countryId) => {
    return useQuery({
        queryKey: ["embassy", countryId],
        queryFn: () => fetchEmbassyByCountryIdApi(countryId),
        enabled: !!countryId,
        // retry: false,
        // staleTime: 5 * 60 * 1000,
    });
}