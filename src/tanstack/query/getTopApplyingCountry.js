import { useQuery } from "@tanstack/react-query";
import { getTopCountry } from "../../functions/fetchTopApplyingCountry";

export function useTopCountry() {
    return useQuery({
        queryKey: ["topCountry"],
        queryFn: () => getTopCountry(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    });
}