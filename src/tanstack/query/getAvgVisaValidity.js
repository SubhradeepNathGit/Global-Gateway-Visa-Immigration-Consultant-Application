import { useQuery } from "@tanstack/react-query";
import { fetchAverageValidityByVisa } from "../../functions/fetchAverageValidityByVisa";

export const useAverageValidity = (visaId) => {
    return useQuery({
        queryKey: ["avg-validity", visaId],
        queryFn: () => fetchAverageValidityByVisa(visaId),
        enabled: Boolean(visaId),
        staleTime: 5 * 60 * 1000,
    });
}