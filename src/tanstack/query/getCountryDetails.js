import { useQuery } from "@tanstack/react-query";
import { getCountryMainDetails, getFullCountryDetails } from "../../functions/getCountryDetails";

export function useFullCountryDetails(id) {
    // console.log("Fetching country's ID", id);

    return useQuery({
        queryKey: ["full_country_details", id],
        queryFn: () => getFullCountryDetails(id),
        enabled: !!id,
    });
}

export function useCountryMainDetails(id) {
    // console.log("Fetching country's ID", id);

    return useQuery({
        queryKey: ["main_country_details", id],
        queryFn: () => getCountryMainDetails(id),
        enabled: !!id,
    });
}
