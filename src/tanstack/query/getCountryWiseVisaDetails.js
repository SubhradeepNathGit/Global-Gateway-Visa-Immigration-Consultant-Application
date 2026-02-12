import { useQuery } from "@tanstack/react-query";
import { fetchCountryWiseVisaDetails } from "../../functions/fetchCountryWiseVisaDetails";

export const useCountryWiseVisaDetails = (countryId) => {
    // console.log('Fetched visa for country Id', countryId);

    return useQuery({
        queryKey: ["visa-for-country", countryId],
        queryFn: () => fetchCountryWiseVisaDetails(countryId),
        enabled: !!countryId
    });
}