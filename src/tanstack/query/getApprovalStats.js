import { useQuery } from "@tanstack/react-query";
import { fetchApprovalStats } from "../../functions/getApprovalStats";

export function useApprovalStats() {
    return useQuery({
        queryKey: ["approval-stats"],
        queryFn: fetchApprovalStats,
        refetchInterval: 60_000,
    });
}