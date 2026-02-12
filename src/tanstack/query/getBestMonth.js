import { useQuery } from "@tanstack/react-query";
import { getBestMonth } from "../../functions/fetchBestMonth";

export function useBestMonth() {
    return useQuery({
        queryKey: ["bestMonth"],
        queryFn: () => getBestMonth(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}