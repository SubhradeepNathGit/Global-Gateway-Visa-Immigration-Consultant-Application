import { useQuery } from "@tanstack/react-query";
import { getFulfilledApplicationsByUser } from "../../functions/fetchUserTravelHistory";

export const useFulfilledApplicationByUser = (userId,status) => {

    return useQuery({
        queryKey: ["applications", "fulfilled", userId,status],
        queryFn: () => getFulfilledApplicationsByUser(userId,status),
        enabled: !!userId && !!status,
        staleTime: 1000 * 60 * 5,
    });
}