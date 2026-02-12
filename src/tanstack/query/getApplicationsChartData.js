import { useQuery } from "@tanstack/react-query";
import { getApplicationsChartData } from "../../functions/getApplicationsDataChart";

export function useApplicationsChart() {
    return useQuery({
        queryKey: ["applications-chart"],
        queryFn: getApplicationsChartData,
        staleTime: 1000 * 60 * 5, 
    });
}
