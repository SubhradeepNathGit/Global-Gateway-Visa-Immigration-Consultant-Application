import { useQuery } from "@tanstack/react-query";
import { getMonthlyRevenue } from "../../functions/transactionApi";

export function useMonthlyRevenue() {
    return useQuery({
        queryKey: ["monthly-revenue"],
        queryFn: getMonthlyRevenue,
        refetchOnWindowFocus: false,
    });
}