import { useQuery } from '@tanstack/react-query';
import { fetchTotalExpenseByUser } from '../../functions/calculateTotalExpense';

export function useTotalExpense(userId) {
    // console.log('Fetching total expense of a specific user in query', userId);

    return useQuery({
        queryKey: ['totalExpense', userId],
        queryFn: () => fetchTotalExpenseByUser(userId),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
    });
}