import { useQuery } from "@tanstack/react-query";
import { fetchVisaDetailsByVisaIdAndCountryId } from "../../functions/fetchVisaDetailsByVisaIdAndCountryId";

export const useVisaDetailsByVisaIddAndCountryId = (visaId, countryId) => {
    return useQuery({
        queryKey: ["visa-details", visaId, countryId],
        queryFn: () => fetchVisaDetailsByVisaIdAndCountryId(visaId, countryId),
        enabled: Boolean(visaId),
        staleTime: 5 * 60 * 1000,
    });
}