import { useQuery } from "@tanstack/react-query";
import { getApplicationStatsByMonth } from "../../functions/getApplicationStatsForEmbassy";

export const useApplicationStats = ({ countryId, statusFilter }) => {
  return useQuery({
    queryKey: ["application_stats", countryId, statusFilter],
    queryFn: () => getApplicationStatsByMonth({
        countryId,
        statusFilter,
      }),
    enabled: !!countryId,
  });
}