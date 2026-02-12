import { useQuery } from "@tanstack/react-query";
import { fetchUserCourseOrders } from "../../functions/fetchUserPurchasedCourse";

export const useUserOrders = ({ userId, status }) => {
    // console.log('Received data for fetching specific user course', userId, status);

    return useQuery({
        queryKey: ["user-orders", userId, status],
        queryFn: () => fetchUserCourseOrders({ userId, status }),
        enabled: !!userId,        
        staleTime: 1000 * 60 * 5, 
    });
};
