import { useQuery } from "@tanstack/react-query";
import { getApprovalRateData } from "../../functions/getApplicationsChartData";

export function useApprovalRateChart() {
    return useQuery({
        queryKey: ["approval-rate-chart"],
        queryFn: getApprovalRateData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
