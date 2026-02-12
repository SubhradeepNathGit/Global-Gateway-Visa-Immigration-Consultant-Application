import { useQuery } from '@tanstack/react-query';
import { fetchApplicationsByUser } from '../../functions/fetchApplicationsByUser';

export function useApplicationsByUser(userId) {
    // console.log('User id for fetching applications in slice', userId);

    return useQuery({
        queryKey: ['applications', userId],
        queryFn: () => fetchApplicationsByUser(userId),
        enabled: !!userId
    });
}
