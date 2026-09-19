import { useQuery } from '@tanstack/react-query'
import { fetchVisaDetails } from '../../functions/fetchVisaDetails'

export const useVisaDetails = ({ countryId, visitorCountryId, visaId }) => {
    return useQuery({
        queryKey: ['visaDetails', countryId, visitorCountryId, visaId],
        queryFn: () =>
            fetchVisaDetails({
                countryId,
                visitorCountryId,
                visaId,
            }),
        enabled: !!countryId && !!visitorCountryId && !!visaId && visaId !== "0",
        staleTime: 5 * 60 * 1000,
    })
}