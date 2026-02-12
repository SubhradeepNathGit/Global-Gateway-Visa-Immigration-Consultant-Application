import { useQuery } from "@tanstack/react-query";
import { fetchSpecificCountryVisaEnable } from "../../functions/fetchSpecificCountryVisaEnable";

export const useSpecificCountryVisaEnable = (country_id) => {
    return useQuery({
        queryKey: ["visa-enable-country", country_id],
        queryFn: () => fetchSpecificCountryVisaEnable(country_id),
        enabled: !!country_id,
        // staleTime: 1000 * 60 * 5,
    });
}