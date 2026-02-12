import { useQuery } from "@tanstack/react-query";
import { getApplicationStats } from "../../functions/getApplicationStats";
import { getPendingApplicationsStats } from "../../functions/getPendingApplicationsStats";
import { getApprovedApplicationsStats } from "../../functions/getApprovedStats";
import { getApplicationStatusStats } from "../../functions/getApplicationStatusStats";

export function useApplicationStats() {
  return useQuery({
    queryKey: ["application-stats"],
    queryFn: getApplicationStats,
  });
}

export function usePendingApplicationsStats() {
  return useQuery({
    queryKey: ["pending-applications-stats"],
    queryFn: getPendingApplicationsStats,
    staleTime: 1000 * 60 * 5,
  });
}

export function useApprovedApplicationsStats() {
  return useQuery({
    queryKey: ["approved-applications-stats"],
    queryFn: getApprovedApplicationsStats,
    staleTime: 1000 * 60 * 5,
  });
}

export function useApplicationStatusStats(id) {
  return useQuery({
    queryKey: ["application-status-stats"],
    queryFn: () => getApplicationStatusStats(id),
    staleTime: 1000 * 60 * 5,
  });
}