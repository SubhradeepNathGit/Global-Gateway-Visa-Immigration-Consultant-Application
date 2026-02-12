import { useQuery } from "@tanstack/react-query";
import { fetchVisaDetailsByVisaId } from "../../functions/fetchVisaDetailsByVisaId";

export const useVisaDetailsByVisaId = (visaId) => {
    return useQuery({
        queryKey: ["visa-details", visaId],
        queryFn: () => fetchVisaDetailsByVisaId(visaId),
        enabled: Boolean(visaId),
        // staleTime: 5 * 60 * 1000,
    });
}