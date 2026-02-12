import { useQuery } from "@tanstack/react-query";
import { fetchUserTotalExpense } from "../../functions/calculateTotalExpenseForCourseSpecificUser";

export const useUserTotalExpense = ({ userId, status = "success" }) => {
    // console.log('Reciving total expense for a specific user course',userId,status);
    
    return useQuery({
        queryKey: ["user-total-expense", userId, status],
        queryFn: () => fetchUserTotalExpense({ userId, status }),
        enabled: !!userId,
        staleTime: 1000 * 60 * 5,
    });
}