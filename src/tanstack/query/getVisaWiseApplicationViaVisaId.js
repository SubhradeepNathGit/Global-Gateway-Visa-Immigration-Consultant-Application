import { useQuery } from "@tanstack/react-query";
import { fetchVisaWiseApplicationViaVisaId } from "../../functions/fetchVisaWiseApplicationViaVisaId";

export function useVisaWiseApplicationViaVisaId({ visaId, applicationStatus }) {
    return useQuery({
        queryKey: ["visa-wise-applications", visaId, applicationStatus],
        queryFn: () => fetchVisaWiseApplicationViaVisaId({ visaId, applicationStatus }),
        enabled: Boolean(visaId),
        staleTime: 5 * 60 * 1000,
    });
}
