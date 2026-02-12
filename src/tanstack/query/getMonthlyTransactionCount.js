import { useQuery } from "@tanstack/react-query";
import { getMonthlyTransactionCount } from "../../functions/getMonthlyTransactionCount";

export function useMonthlyTransactionCount() {
    return useQuery({
        queryKey: ["monthly-transaction-count"],
        queryFn: getMonthlyTransactionCount,
        refetchOnWindowFocus: false
    });
}