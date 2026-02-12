import { useQuery } from "@tanstack/react-query";
import { fetchFullApplicationDetails } from "../../functions/fetchFullApplicationDetails";

export const useFullApplicationDetailsById = (applicationId) => {
    // console.log('Received application id to fetch details in query', applicationId);

    return useQuery({
        queryKey: ["application", applicationId],
        queryFn: () => fetchFullApplicationDetails(applicationId),
        enabled: !!applicationId,
        staleTime: 0,
        refetchOnMount: "always",
    });
}
