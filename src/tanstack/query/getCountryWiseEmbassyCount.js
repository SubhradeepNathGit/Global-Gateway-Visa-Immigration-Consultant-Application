import { useQuery } from '@tanstack/react-query';
import { getAvailableEmbassyCount } from '../../functions/countEmbassyNumber';

export const useAvailableEmbassyCount = (countryId) => {
    return useQuery({
        queryKey: ['availableEmbassyCount', countryId],
        queryFn: () => getAvailableEmbassyCount(countryId),
        enabled: !!countryId,
    });
};
