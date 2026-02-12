import { useQuery } from "@tanstack/react-query";
import { getVisaDetailsById } from "../../functions/fetchSpecificVisaDetails";

export const useVisaDetails = ({ country_id, visa_id }) => {
    return useQuery({
        queryKey: ["visa-details", visa_id],
        queryFn: () => getVisaDetailsById({ country_id, visa_id }),
        enabled: !!visa_id,
        staleTime: 1000 * 60 * 5,
    });
}