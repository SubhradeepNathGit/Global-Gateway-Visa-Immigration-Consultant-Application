import { useQuery } from "@tanstack/react-query";
import { fetchCourseRevenue } from "../../functions/fetchCourseRevenue";

export const useCourseRevenue = ({ status = "success" } = {}) => {
    return useQuery({
        queryKey: ["course-revenue", status],
        queryFn: () => fetchCourseRevenue({ status }),
        staleTime: 1000 * 60 * 10, 
    });
}