import { useQuery } from "@tanstack/react-query";
import { fetchAverageProcessingTimeByVisa } from "../../functions/fetchAverageVisaProcessing";

export const useAverageProcessingTime = (visaId) => {
    return useQuery({
        queryKey: ["avg-processing-time", visaId],
        queryFn: () => fetchAverageProcessingTimeByVisa(visaId),
        enabled: Boolean(visaId),
        staleTime: 5 * 60 * 1000,
    });
}