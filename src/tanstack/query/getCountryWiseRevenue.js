import { useQuery } from "@tanstack/react-query";
import { calculateCountryWiseRevenue } from "../../functions/calculateCountryWiseRevenue";

export function useCountryTransactions(country_id) {
    return useQuery({
        queryKey: ["countryTransactions", country_id],
        queryFn: () => calculateCountryWiseRevenue(country_id),
        staleTime: 1000 * 60 * 5,
    }
    );
}
