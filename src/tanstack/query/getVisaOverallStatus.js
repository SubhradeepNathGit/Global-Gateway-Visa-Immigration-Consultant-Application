import { useQuery } from "@tanstack/react-query";
import { fetchVisaStatusData } from "../../functions/fetchVisaStatusByVisaAndCountry";
import { calculateVisaOverallStatus } from "../../util/avgVisaConverter/visa-status/calculateVisaOverallStatus";

export const useVisaOverallStatus = (visaId, countryId) => {
    return useQuery({
        queryKey: ["visa-status", visaId, countryId],
        queryFn: async () => {
            const rows = await fetchVisaStatusData(visaId, countryId);
            return calculateVisaOverallStatus(rows);
        },
        enabled: Boolean(visaId && countryId),
    });
}