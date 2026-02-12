import { useQuery } from "@tanstack/react-query";
import { fetchVisaTypeDistribution } from "../../functions/fetchVisaTypeDistribution";

export function useVisaTypeDistribution() {
    return useQuery({
        queryKey: ["visaTypeDistribution"],
        queryFn: fetchVisaTypeDistribution,
        staleTime: 1000 * 60 * 5, 
    });
}
