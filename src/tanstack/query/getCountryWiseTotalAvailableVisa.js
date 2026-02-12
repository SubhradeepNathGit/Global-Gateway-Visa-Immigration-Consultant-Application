import { useQuery } from "@tanstack/react-query";
import { calculateCountryWiseTotalAvailableVisa } from "../../functions/calculateCountryWiseTotalAvailableVisa";

export const useCountryWiseTotalVisaCount = (countryId) => {
    // console.log('Fetched visa for country Id', countryId);

    return useQuery({
        queryKey: ["visa-count-for-country", countryId],
        queryFn: () => calculateCountryWiseTotalAvailableVisa(countryId),
        enabled: !!countryId,
    });
}