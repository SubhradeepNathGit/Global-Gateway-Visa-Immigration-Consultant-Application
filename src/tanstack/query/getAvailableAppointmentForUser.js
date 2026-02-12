import { useQuery } from "@tanstack/react-query";
import { fetchAvailableAppointmentForUser } from "../../functions/fetchAvailableAppointmentForUser";

export const useApplicationsWithAppointmentForUser = (userId, status, hasAppointment) => {
    return useQuery({
        queryKey: ["applications", userId, status, hasAppointment],
        queryFn: () => fetchAvailableAppointmentForUser(userId, status, hasAppointment),
        enabled: !!userId
    });
};
