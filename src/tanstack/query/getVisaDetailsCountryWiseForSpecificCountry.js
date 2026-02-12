import { useQuery } from "@tanstack/react-query";
import { fetchCountryVisaForSpecificCountry } from "../../functions/fetchVisaDetailsCountryWiseForSpecificCountry";

export const useCountryVisaForSpecificCountry = (countryId) => {
    return useQuery({
        queryKey: ["countryVisa", countryId],
        queryFn: () => fetchCountryVisaForSpecificCountry({ countryId }),
        enabled: !!countryId, 
        // staleTime: 5 * 60 * 1000, 
        retry: 1, 
    });
};
