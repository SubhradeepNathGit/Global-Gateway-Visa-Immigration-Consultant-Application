import { useQuery } from "@tanstack/react-query";
import { getMonthlyTransactionsByStatus } from "../../functions/getMonthlyTransactionsByStatus";

export function useMonthlyTransactionsByStatus(status) {
    return useQuery({
        queryKey: ["monthly-success-transactions",status],
        queryFn: () => getMonthlyTransactionsByStatus(status),
        refetchOnWindowFocus: false,
    });
}
