import { useQuery } from "@tanstack/react-query";
import { fetchCourseRatingCount } from "../../functions/fetchCourseWiseRatingCount";

export const useCourseWiseRatingCount = (courseId) => {
    // console.log('Received data for fetching course wise rating count in query', courseId);

    return useQuery({
        queryKey: ['courseRatingCount', courseId],
        queryFn: () => fetchCourseRatingCount(courseId),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};