import { useQuery } from "@tanstack/react-query";
import { getRevenueTrend } from "../../functions/fetchRevenueTrend";

export const useRevenueTrend = () => {
    return useQuery({
        queryKey: ["revenue-trend"],
        queryFn: getRevenueTrend,
        staleTime: 5 * 60 * 1000,
    });
};
