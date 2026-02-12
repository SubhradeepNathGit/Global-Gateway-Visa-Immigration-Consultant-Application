import { useQuery } from "@tanstack/react-query";
import { fetchApplicationByUserAndCountry } from "../../functions/fetchCurrentApplication";

export function useApplicationByUserAndCountry(user_id, country_id) {
    // console.log('Fetching active application for specific country and specific user in hooks', country_id, user_id);

    return useQuery({
        queryKey: ["application", user_id, country_id],
        queryFn: () => fetchApplicationByUserAndCountry(user_id, country_id),
        enabled: !!user_id && !!country_id,
        staleTime: 1000 * 60 * 2,
        refetchOnWindowFocus: false,
    });
}
