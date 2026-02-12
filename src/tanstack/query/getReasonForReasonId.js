import { useQuery } from "@tanstack/react-query";
import { fetchAppointmentReasonByReasonId } from "../../functions/fetchReasonForReasonId";

export const useAppointmentReasonByReasonId = (reasonId) => {
    return useQuery({
        queryKey: ["appointment-reason", reasonId],
        queryFn: () => fetchAppointmentReasonByReasonId(reasonId),
        enabled: !!reasonId,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });
}