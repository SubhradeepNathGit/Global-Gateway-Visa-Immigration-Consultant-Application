import { useQuery } from "@tanstack/react-query";
import { fetchApplicationsWithAppointment } from "../../functions/fetchApplicationsWithAppointment";

export const useApplicationsWithAppointment = (countryId, status, hasAppointment) => {
    return useQuery({
        queryKey: ["applications", countryId, status, hasAppointment],
        queryFn: () => fetchApplicationsWithAppointment(countryId, status, hasAppointment),
        enabled: !!countryId
    });
};
