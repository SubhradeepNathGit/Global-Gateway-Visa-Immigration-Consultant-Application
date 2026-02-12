import { useQuery } from "@tanstack/react-query";
import { getUserCertificates } from "../../functions/fetchSpecificCertificateDetails";

export const useUserCertificates = ({ userId, courseId }) => {
    // console.log('Received data for fetching specific certificate details in query', userId, courseId);

    return useQuery({
        queryKey: ["user-certificates", userId, courseId],
        queryFn: () => getUserCertificates({ userId, courseId }),
        enabled: Boolean(userId && courseId), 
        // staleTime: 1000 * 60 * 5,

        refetchInterval: 1000 * 10, 
        refetchIntervalInBackground: true, 
    });
};
