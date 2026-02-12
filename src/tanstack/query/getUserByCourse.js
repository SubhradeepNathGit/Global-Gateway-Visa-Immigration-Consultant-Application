import { useQuery } from "@tanstack/react-query";
import { fetchUsersByCourse } from "../../functions/fetchUsersByCourse";

export const useUsersByCourse = ({ courseId, status }) => {
    // console.log('Received data for fetching user of a course in query data', courseId, status);

    return useQuery({
        queryKey: ["users-by-course", courseId, status],
        queryFn: () => fetchUsersByCourse({ courseId, status }),
        enabled: !!courseId,
        staleTime: 5 * 60 * 1000, 
    });
};