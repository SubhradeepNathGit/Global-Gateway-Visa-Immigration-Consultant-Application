import { useQuery } from "@tanstack/react-query";
import { fetchVisaDetailsByApplicationId } from "../../functions/fetchApplicationVisaDetails";

export function useVisaDetailsByApplicationId(applicationId) {
    // console.log('Application id for fetching visa details', applicationId);

    return useQuery({
        queryKey: ["visa-details", applicationId],
        queryFn: () => fetchVisaDetailsByApplicationId(applicationId),
        enabled: !!applicationId, 
    });
}
