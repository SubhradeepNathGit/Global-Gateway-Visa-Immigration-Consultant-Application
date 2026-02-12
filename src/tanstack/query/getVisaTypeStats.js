import { useQuery } from "@tanstack/react-query";
import { fetchVisaTypeStats } from "../../functions/fetchVisaTypeStats";

export function useVisaTypeStats() {
    return useQuery({
        queryKey: ["visa-type-stats"],
        queryFn: fetchVisaTypeStats,
        refetchOnWindowFocus: false,
    });
}