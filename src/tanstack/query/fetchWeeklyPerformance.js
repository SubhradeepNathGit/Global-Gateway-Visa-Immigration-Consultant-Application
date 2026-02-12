import { useQuery } from "@tanstack/react-query";
import { fetchWeeklyPerformance } from "../../functions/fetchWeeklyPerformance";

export const useWeeklyPerformance = () => {
    return useQuery({
        queryKey: ["weekly-performance"],
        queryFn: fetchWeeklyPerformance,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}