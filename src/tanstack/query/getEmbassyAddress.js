import { useQuery } from '@tanstack/react-query';
import { fetchEmbassiesAddress } from '../../functions/fetchEmbassyAddress';

export const useEmbassiesAddress = (countryId) => {
    return useQuery({
        queryKey: ['embassies', countryId],
        queryFn: () => fetchEmbassiesAddress(countryId),
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}