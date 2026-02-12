import { useQuery } from "@tanstack/react-query";
import { getAverageProcessingTimes } from "../../functions/getAverageProcessingTimes";

export function useAverageProcessingTimes() {
    return useQuery({
        queryKey: ["average-processing-times"],
        queryFn: getAverageProcessingTimes,
        staleTime: 1000 * 60 * 5,
    });
}