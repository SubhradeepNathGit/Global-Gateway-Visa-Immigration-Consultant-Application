import { useQuery } from "@tanstack/react-query";
import { fetchRevenueTrends } from "../../functions/fetchRevenueTrends";

export function useRevenueTrends(year) {
    return useQuery({
        queryKey: ["revenueTrends", year],
        queryFn: () => fetchRevenueTrends(year),
        staleTime: 1000 * 60 * 5,
    });
}