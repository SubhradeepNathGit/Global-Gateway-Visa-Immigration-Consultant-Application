import { useQuery } from "@tanstack/react-query";
import { fetchUserWiseCourseRating } from "../../functions/fetchUserWiseCourseRating";

export const useCourseWiseCourseRating = (courseId, userId) => {
    // console.log('Received data for fetching user wise course rating in query', courseId,userId);

    return useQuery({
        queryKey: ['courseAvgRating', courseId, userId],
        queryFn: () => fetchUserWiseCourseRating(courseId, userId),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};