import { useQuery } from "@tanstack/react-query";
import { getTopVisa } from "../../functions/getTopVisa";

export function useTopVisa() {
    return useQuery({
        queryKey: ["topVisa"],
        queryFn: () => getTopVisa(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}