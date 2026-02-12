import { useQuery } from "@tanstack/react-query";
import { getCountriesStats } from "../../functions/fetchCountriesCount";

export function useCountriesStats() {
    return useQuery({
        queryKey: ["countriesStats"],
        queryFn: () => getCountriesStats(),
        staleTime: 5 * 60 * 1000,
    });
}