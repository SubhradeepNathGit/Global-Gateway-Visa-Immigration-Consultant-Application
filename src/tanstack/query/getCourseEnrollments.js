import { useQuery } from "@tanstack/react-query";
import { fetchCourseEnrollments } from "../../functions/fetchCourseEnrollments";

export const useCourseEnrollments = ({ status = "success" } = {}) => {
    return useQuery({
        queryKey: ["course-enrollments", status],
        queryFn: () => fetchCourseEnrollments({ status }),
        staleTime: 1000 * 60 * 10,
    });
}