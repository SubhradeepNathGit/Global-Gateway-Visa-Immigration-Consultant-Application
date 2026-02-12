import { useQuery } from "@tanstack/react-query";
import { fetchAllVisaPoliciesForCountry } from "../../functions/fetchAllVisaPoliciesForCountry";

export function useAllVisaPoliciesForCountry() {
    return useQuery({
        queryKey: ["countryWiseAllVisaPolicy"],
        queryFn: () => fetchAllVisaPoliciesForCountry(),
        refetchOnWindowFocus: false,
    });
}