import { useQuery } from "@tanstack/react-query";
import { fetchCourseAvgRating } from "../../functions/fetchCourseAvgRating";

export const useCourseAvgRating = (courseId) => {
    // console.log('Received data for fetching course wise rating in query', courseId);

    return useQuery({
        queryKey: ['courseAvgRating', courseId],
        queryFn: () => fetchCourseAvgRating(courseId),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};