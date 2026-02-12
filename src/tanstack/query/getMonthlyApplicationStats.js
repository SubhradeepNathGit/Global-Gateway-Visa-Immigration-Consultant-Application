import { useQuery } from "@tanstack/react-query";
import { fetchMonthlyApplicationStats } from "../../functions/getMonthlyApplicationStats";

export function useMonthlyApplicationStats() {
    return useQuery({
        queryKey: ["monthly-application-stats"],
        queryFn: fetchMonthlyApplicationStats,
        staleTime: 1000 * 60 * 5,
    });
}