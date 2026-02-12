import { useQuery } from "@tanstack/react-query";
import { fetchTotalRevenue } from "../../functions/calculateTotalRevenue";

export function useTotalRevenue() {
    return useQuery({
        queryKey: ["totalRevenue"],
        queryFn: fetchTotalRevenue,
        staleTime: 5 * 60 * 1000,
    });
}