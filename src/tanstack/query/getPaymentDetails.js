import { useQuery } from '@tanstack/react-query';
import { fetchApplicationPayments } from '../../functions/fetchPaymentDetails';

export function useApplicationPaymentsByApplicationId(applicationId) {
    // console.log('Application id for fetching application payment in hook', applicationId);

    return useQuery({
        queryKey: ['applicationPayments', applicationId],
        queryFn: ()=>fetchApplicationPayments(applicationId),
        enabled: !!applicationId,
    });
}