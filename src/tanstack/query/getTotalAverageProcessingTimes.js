import { useQuery } from "@tanstack/react-query";
import { calculateTotalAverageProcessingTimes } from "../../functions/calculateTotalAverageProcessingTimes";

export const useAverageProcessingTimes = () => {
    return useQuery({
        queryKey: ["averageProcessingTimes"],
        queryFn: () => calculateTotalAverageProcessingTimes()
    });
};