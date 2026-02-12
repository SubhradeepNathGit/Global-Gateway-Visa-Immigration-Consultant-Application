import { useQuery } from "@tanstack/react-query";
import { fetchVisaSummary } from "../../functions/fetchVisaSummary";

export const useVisaSummary = (visaId) => {
    return useQuery({
        queryKey: ["visa-summary", visaId],
        queryFn: () => fetchVisaSummary(visaId),
        enabled: Boolean(visaId),
        // staleTime: 5 * 60 * 1000,
    });
}