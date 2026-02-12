import { useQuery } from "@tanstack/react-query";
import { fetchCountryDetails } from "../../functions/fetchCountryDetails";

export const useCountryDetails = (countryName) => {

    return useQuery({
        queryKey: ["countryDetails", countryName],
        queryFn: fetchCountryDetails,
        enabled: !!countryName,
        staleTime: 1000 * 60 * 10,
    });
};
